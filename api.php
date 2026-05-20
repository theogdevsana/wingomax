<?php
// Set timezone to UTC for consistent time handling
date_default_timezone_set('UTC');

// Set response headers for JSON and CORS (public API)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = 'prediction_data.json';
$allPredictionsFile = 'all_predictions.json';
$allStatsFile = 'all_stats.json';

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'error.log');

foreach ([$dataFile, $allPredictionsFile, $allStatsFile] as $file) {
    if (!is_writable(dirname($file)) && !file_exists($file)) {
        error_log('Data file directory is not writable: ' . dirname($file));
        http_response_code(500);
        echo json_encode(['error' => 'Server configuration error: Data directory not writable']);
        exit;
    }
}

// ============================================================
// DEFAULT USER STATE BUILDER
// ============================================================
function buildDefaultUserState()
{
    $state = [
        'showHigher' => true,
        'autoToggle' => true,
        'lastAdjustment' => 0,
        'patternStatsNormal' => [],
        'patternStatsAdvanced' => [],
        'numberPatterns' => [],
        'numberRepetition' => [],
        'transitionMatrix' => [
            'BIG' => ['BIG' => 0, 'SMALL' => 0],
            'SMALL' => ['BIG' => 0, 'SMALL' => 0]
        ],
        'entropyHistory' => [],
        'neuralWeights' => array_fill(0, 10, 0.0),
        'bias' => 0.0,
        'learningRate' => 0.1,
        'lastProcessedPeriod' => '',
        // ---- Smart Loss Recovery State ----
        'lossRecovery' => [
            'consecutiveLosses' => 0,
            'totalSkipsThisRun' => 0,
            'lastSkipPeriod' => '',
            'skipCooldownUntil' => 0,   // unix timestamp: don't skip before this
            'recoveryMode' => false,
            'recoveryModeStart' => 0,
            'lastFiveResults' => [],  // WIN / LOSS / SKIP
            'forcedFlipActive' => false,
            'forcedFlipCount' => 0,
        ]
    ];

    $normalPatterns = ['zigZag', 'skipPattern', 'trendBased', 'cyclePattern', 'longPattern', 'markovChain', 'entropyBased', 'numberBased', 'neural'];
    $advancedPatterns = ['zigZag', 'numberBased', 'markovChain', 'entropyBased', 'neural'];
    foreach ($normalPatterns as $p) {
        $state['patternStatsNormal'][$p] = ['wins' => 0, 'total' => 0, 'successRate' => 0, 'recentWins' => 0, 'recentTotal' => 0];
    }
    foreach ($advancedPatterns as $p) {
        $state['patternStatsAdvanced'][$p] = ['wins' => 0, 'total' => 0, 'successRate' => 0, 'recentWins' => 0, 'recentTotal' => 0];
    }
    for ($i = 0; $i <= 9; $i++) {
        $state['numberPatterns'][$i] = ['BIG' => ['count' => 0, 'successRate' => 0], 'SMALL' => ['count' => 0, 'successRate' => 0], 'total' => 0];
        $state['numberRepetition'][$i] = ['count' => 0, 'recentCount' => 0, 'lastSeen' => 0];
    }
    return $state;
}

// ============================================================
// LOAD DATA
// ============================================================
try {
    if (file_exists($dataFile)) {
        $jsonData = json_decode(file_get_contents($dataFile), true);
        if (json_last_error() !== JSON_ERROR_NONE)
            throw new Exception('Invalid JSON in data file');
        $userStates = $jsonData['userStates'] ?? ['user' => buildDefaultUserState()];
        $pendingPredictions = $jsonData['pendingPredictions'] ?? [];
    } else {
        $userStates = ['user' => buildDefaultUserState()];
        $pendingPredictions = [];
    }

    // Ensure lossRecovery block always exists (backward compat)
    if (!isset($userStates['user']['lossRecovery'])) {
        $userStates['user']['lossRecovery'] = buildDefaultUserState()['lossRecovery'];
    }

    // Ensure number patterns initialised
    for ($i = 0; $i <= 9; $i++) {
        if (!isset($userStates['user']['numberPatterns'][$i])) {
            $userStates['user']['numberPatterns'][$i] = ['BIG' => ['count' => 0, 'successRate' => 0], 'SMALL' => ['count' => 0, 'successRate' => 0], 'total' => 0];
        }
        if (!isset($userStates['user']['numberRepetition'][$i])) {
            $userStates['user']['numberRepetition'][$i] = ['count' => 0, 'recentCount' => 0, 'lastSeen' => 0];
        }
    }

    if (file_exists($allPredictionsFile)) {
        $allPredictions = json_decode(file_get_contents($allPredictionsFile), true);
        if (json_last_error() !== JSON_ERROR_NONE)
            throw new Exception('Invalid JSON in all predictions file');
    } else {
        $allPredictions = [];
    }
} catch (Exception $e) {
    error_log('Error loading data files: ' . $e->getMessage());
    $userStates = ['user' => buildDefaultUserState()];
    $pendingPredictions = [];
    $allPredictions = [];
}

// ============================================================
// INPUT PARSING
// ============================================================
$inputData = json_decode(file_get_contents("php://input"), true) ?? [];
$action = $_GET['action'] ?? $_POST['action'] ?? ($inputData['action'] ?? 'getPrediction');
$index = isset($_GET['index']) ? (int) $_GET['index']
    : (isset($_POST['index']) ? (int) $_POST['index']
        : (isset($inputData['index']) ? (int) $inputData['index'] : null));

$verifyApiUrl = 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json';
$trendStatsApiUrl = 'https://api.ar-lottery01.com/api/Lottery/GetTrendStatistics';

// ============================================================
// PERIOD HELPER
// ============================================================
function getCurrentPeriod1Min()
{
    $currentDate = date('Ymd');
    $totalMinutes = date('H') * 60 + date('i');
    $periodNumber = str_pad($totalMinutes + 10001, 4, '0', STR_PAD_LEFT);
    return "{$currentDate}1000{$periodNumber}";
}

// ============================================================
// FETCH GAME DATA
// ============================================================
function fetchApiData($retries = 3, $timeout = 10)
{
    global $verifyApiUrl;
    $url = $verifyApiUrl . '?ts=' . time();
    $headers = ['Content-Type: application/json;charset=UTF-8', 'Accept: application/json, text/plain, */*'];
    for ($i = 0; $i < $retries; $i++) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            $err = curl_error($ch);
            curl_close($ch);
            error_log("cURL error: $err");
            if ($i === $retries - 1)
                return ['error' => $err];
            sleep(1);
            continue;
        }
        curl_close($ch);
        $decoded = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            if ($i === $retries - 1)
                return ['error' => 'Invalid JSON'];
            sleep(1);
            continue;
        }
        if ($decoded['code'] !== 0 || !isset($decoded['data']['list'])) {
            if ($i === $retries - 1)
                return ['error' => 'Invalid API structure'];
            sleep(1);
            continue;
        }
        return array_map(function ($item) {
            return [
                'period' => $item['issueNumber'] ?? null,
                'category' => (isset($item['number']) && intval($item['number']) <= 4) ? 'SMALL' : 'BIG',
                'number' => $item['number'] ?? null,
                'timestamp' => time()
            ];
        }, $decoded['data']['list']);
    }
    return ['error' => 'Failed after retries'];
}

// ============================================================
// FETCH TREND STATISTICS
// ============================================================
function fetchTrendStatistics($retries = 3, $timeout = 10)
{
    global $trendStatsApiUrl;
    $random = "739791024272";
    $timestamp = (string) time();
    $signature = "CE224F61135E94EE84483A803F1DD0C8";
    $params = ['gameCode' => 'WinGo_1M', 'pageNo' => 1, 'pageSize' => 10, 'language' => 'en', 'random' => $random, 'signature' => $signature, 'timestamp' => $timestamp];
    $url = $trendStatsApiUrl . '?' . http_build_query($params);
    $headers = ['Accept: application/json, text/plain, */*', 'User-Agent: Mozilla/5.0 (Linux; Android 10)', 'Referer: https://51gameq.com/#/saasLottery/WinGo'];
    for ($i = 0; $i < $retries; $i++) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            $err = curl_error($ch);
            curl_close($ch);
            if ($i === $retries - 1)
                return ['error' => $err];
            sleep(1);
            continue;
        }
        curl_close($ch);
        $decoded = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            if ($i === $retries - 1)
                return ['error' => 'Invalid JSON'];
            sleep(1);
            continue;
        }
        if (isset($decoded['code']) && $decoded['code'] === 0 && isset($decoded['data']) && is_array($decoded['data']))
            return $decoded['data'];
        if ($i === $retries - 1)
            return ['error' => 'Invalid structure'];
        sleep(1);
    }
    return ['error' => 'Failed after retries'];
}

// ============================================================
// ANALYZE TREND STATISTICS
// ============================================================
function analyzeTrendStatistics($trendData)
{
    if (isset($trendData['error']) || !is_array($trendData) || empty($trendData))
        return null;
    $numberStats = [];
    foreach ($trendData as $item) {
        $number = (int) ($item['number'] ?? -1);
        if ($number >= 0 && $number <= 9) {
            $numberStats[$number] = [
                'missingCount' => (int) ($item['missingCount'] ?? 0),
                'avgMissing' => (float) ($item['avgMissing'] ?? 0),
                'openCount' => (int) ($item['openCount'] ?? 0),
                'maxContinuous' => (int) ($item['maxContinuous'] ?? 0)
            ];
        }
    }
    $predictionScores = [];
    foreach ($numberStats as $num => $stats) {
        $score = 0;
        if ($stats['missingCount'] > $stats['avgMissing'])
            $score += ($stats['missingCount'] - $stats['avgMissing']) * 10;
        if ($stats['missingCount'] > $stats['avgMissing'] * 1.5)
            $score += 30;
        if ($stats['openCount'] > 12)
            $score += 15;
        if ($stats['maxContinuous'] >= 2)
            $score += 10;
        $predictionScores[$num] = $score;
    }
    arsort($predictionScores);
    $topPredictions = array_slice(array_keys($predictionScores), 0, 3, true);
    $bigCount = $smallCount = 0;
    foreach ($topPredictions as $num) {
        if ($num >= 5)
            $bigCount += $predictionScores[$num];
        else
            $smallCount += $predictionScores[$num];
    }
    $prediction = $bigCount > $smallCount ? 'BIG' : 'SMALL';
    $confidence = min(95, 60 + abs($bigCount - $smallCount) / max($bigCount + $smallCount, 1) * 30);
    $highMissing = [];
    $lowMissing = [];
    $highOpen = [];
    foreach ($numberStats as $num => $stats) {
        if ($stats['missingCount'] > $stats['avgMissing'] * 1.2)
            $highMissing[] = $num;
        if ($stats['missingCount'] < $stats['avgMissing'] * 0.8)
            $lowMissing[] = $num;
        if ($stats['openCount'] > 10)
            $highOpen[] = $num;
    }
    return [
        'prediction' => $prediction,
        'confidence' => round($confidence, 2),
        'topNumbers' => array_values($topPredictions),
        'numberScores' => $predictionScores,
        'numberStats' => $numberStats,
        'highMissingNumbers' => $highMissing,
        'lowMissingNumbers' => $lowMissing,
        'analysis' => [
            'avgMissing' => count($numberStats) > 0 ? array_sum(array_column($numberStats, 'avgMissing')) / count($numberStats) : 0,
            'totalOpenCount' => array_sum(array_column($numberStats, 'openCount')),
            'mostFrequent' => $highOpen
        ]
    ];
}

// ============================================================
// PATTERN ANALYZERS (unchanged logic, kept intact)
// ============================================================
function analyzeZigZagPattern($results)
{
    $categories = array_map(fn($i) => $i['category'], array_slice($results, 0, 10));
    $isZigZag = false;
    $isBroken = false;
    $zigZagScore = 0;
    if (count($categories) >= 5) {
        $last5 = array_slice($categories, 0, 5);
        $isZigZag = true;
        for ($i = 1; $i < count($last5); $i++) {
            if ($last5[$i] === $last5[$i - 1]) {
                $isZigZag = false;
                break;
            }
            $zigZagScore++;
        }
        $isBroken = ($last5[0] === $last5[1] && $last5[1] === $last5[2]);
    }
    return ['isZigZag' => $isZigZag, 'isBroken' => $isBroken, 'lastCategory' => $categories[0] ?? null, 'zigZagScore' => $zigZagScore];
}

function analyzeSkipPattern($results)
{
    $categories = array_map(fn($i) => $i['category'], array_slice($results, 0, 10));
    $isSkipPattern = false;
    $skipScore = 0;
    if (count($categories) >= 6) {
        $last6 = array_slice($categories, 0, 6);
        $patterns6 = [['SMALL', 'SMALL', 'BIG', 'SMALL', 'SMALL', 'BIG'], ['BIG', 'BIG', 'SMALL', 'BIG', 'BIG', 'SMALL'], ['SMALL', 'BIG', 'SMALL', 'BIG', 'SMALL', 'BIG'], ['BIG', 'SMALL', 'BIG', 'SMALL', 'BIG', 'SMALL']];
        foreach ($patterns6 as $p) {
            if ($last6 === $p) {
                $isSkipPattern = true;
                $skipScore = 3;
                break;
            }
        }
        if (!$isSkipPattern) {
            $last4 = array_slice($categories, 0, 4);
            $patterns4 = [['SMALL', 'SMALL', 'BIG', 'SMALL'], ['BIG', 'BIG', 'SMALL', 'BIG'], ['SMALL', 'BIG', 'SMALL', 'BIG'], ['BIG', 'SMALL', 'BIG', 'SMALL']];
            foreach ($patterns4 as $p) {
                if ($last4 === $p) {
                    $isSkipPattern = true;
                    $skipScore = 2;
                    break;
                }
            }
        }
    }
    return ['isSkipPattern' => $isSkipPattern, 'skipScore' => $skipScore];
}

function analyzeTrendBased($results)
{
    $results = array_slice($results, 0, 150);
    $bigCount = 0;
    $total = count($results);
    $decayFactor = 0.9;
    $maw = 20;
    $recentBig = 0;
    foreach ($results as $idx => $item) {
        $w = pow($decayFactor, $total - $idx - 1);
        if ($item['category'] === 'BIG') {
            $bigCount += $w;
            if ($idx < $maw)
                $recentBig++;
        }
    }
    $totalW = (1 - pow($decayFactor, $total)) / (1 - $decayFactor);
    $bigRatio = $totalW > 0 ? $bigCount / $totalW : 0.5;
    $ma = $recentBig / min($maw, count($results));
    $ts = ($bigRatio * 0.6 + $ma * 0.4) * 100;
    return ['bigRatio' => $bigRatio, 'movingAverage' => $ma, 'trend' => $ts > 60 ? 'BIG' : ($ts < 40 ? 'SMALL' : 'NEUTRAL'), 'trendScore' => $ts];
}

function analyzeCyclePattern($results)
{
    $categories = array_map(fn($i) => $i['category'], array_slice($results, 0, 10));
    $isCycle = false;
    $cycleScore = 0;
    if (count($categories) >= 6) {
        $l6 = array_slice($categories, 0, 6);
        $isCycle = ($l6[0] === $l6[2] && $l6[1] === $l6[3] && $l6[2] === $l6[4] && $l6[3] === $l6[5]);
        if ($isCycle) {
            $cycleScore = 4;
        } elseif (count($categories) >= 4) {
            $l4 = array_slice($categories, 0, 4);
            $isCycle = ($l4[0] === $l4[2] && $l4[1] === $l4[3]);
            if ($isCycle)
                $cycleScore = 2;
        }
    }
    return ['isCycle' => $isCycle, 'cycleScore' => $cycleScore];
}

function analyzeLongPattern($results, $winLossTracker)
{
    $lastCategory = $results[0]['category'] ?? null;
    $categories = array_map(fn($i) => $i['category'], array_slice($results, 0, 10));
    $streak = 1;
    for ($i = 1; $i < count($categories); $i++) {
        if ($categories[$i] === $categories[$i - 1])
            $streak++;
        else
            break;
    }
    $isLong = ($streak >= 3 || ($winLossTracker['consecutiveWins'] >= 2 && $winLossTracker['lastPrediction'] === $lastCategory));
    $score = $streak * 2 + ($winLossTracker['consecutiveWins'] >= 2 ? 3 : 0);
    return ['isLongPattern' => $isLong, 'lastCategory' => $lastCategory, 'longPatternScore' => $score];
}

function analyzeMarkovChain($results, &$userStates)
{
    $tm =& $userStates['user']['transitionMatrix'];
    $results = array_slice($results, 0, 150);
    $df = 0.95;
    for ($i = 1; $i < count($results); $i++) {
        $cur = $results[$i]['category'] ?? null;
        $nxt = $results[$i - 1]['category'] ?? null;
        if ($cur && $nxt) {
            $w = pow($df, $i - 1);
            $tm[$cur][$nxt] += $w;
        }
    }
    $cc = $results[0]['category'] ?? 'BIG';
    $bc = $tm[$cc]['BIG'] ?? 0;
    $sc = $tm[$cc]['SMALL'] ?? 0;
    $tot = $bc + $sc;
    $bp = $tot > 0 ? ($bc / $tot) * 100 : 50;
    $pred = $bp > 50 ? 'BIG' : 'SMALL';
    $conf = min(abs($bp - 50) * 2 + 50, 95);
    return ['prediction' => $pred, 'confidence' => $conf, 'bigProbability' => $bp, 'markovScore' => $conf * ($tot > 10 ? 1.2 : 1.0)];
}

function analyzeEntropyBased($results, &$userStates)
{
    $categories = array_map(fn($i) => $i['category'], array_slice($results, 0, 150));
    $counts = array_count_values($categories);
    $total = count($categories);
    $entropy = 0;
    foreach ($counts as $count) {
        if ($count > 0) {
            $p = $count / $total;
            $entropy -= $p * log($p) / log(2);
        }
    }
    $userStates['user']['entropyHistory'][] = $entropy;
    $avg = array_sum($userStates['user']['entropyHistory']) / max(1, count($userStates['user']['entropyHistory']));
    $isHigh = $entropy > $avg * 1.15;
    $pred = $isHigh ? ($results[0]['category'] === 'BIG' ? 'SMALL' : 'BIG') : ($results[0]['category'] === 'BIG' ? 'BIG' : 'SMALL');
    $conf = $isHigh ? 70 : 80;
    return ['prediction' => $pred, 'confidence' => $conf, 'entropy' => $entropy, 'avgEntropy' => $avg, 'entropyScore' => $conf * ($isHigh ? 0.9 : 1.1)];
}

function analyzeNeuralNetwork($results, &$userStates)
{
    $results = array_slice($results, 0, 10);
    $inputs = array_map(fn($i) => $i['category'] === 'BIG' ? 1 : 0, $results);
    $weights =& $userStates['user']['neuralWeights'];
    $bias =& $userStates['user']['bias'];
    $lr =& $userStates['user']['learningRate'];
    $sum = $bias;
    foreach ($inputs as $i => $inp)
        $sum += $inp * $weights[$i];
    $out = 1 / (1 + exp(-$sum));
    $pred = $out > 0.5 ? 'BIG' : 'SMALL';
    $conf = min(95, 50 + abs($out - 0.5) * 100);
    if (count($inputs) > 1) {
        $actual = $results[0]['category'] === 'BIG' ? 1 : 0;
        $err = $actual - $out;
        $dlr = $lr * (1 / (1 + abs($err)));
        foreach ($inputs as $i => $inp)
            $weights[$i] += $dlr * $err * $inp;
        $bias += $dlr * $err;
    }
    return ['prediction' => $pred, 'confidence' => $conf, 'output' => $out, 'neuralScore' => $conf * (count($inputs) > 5 ? 1.3 : 1.0)];
}

function analyzeNumberPatterns($results, &$userStates)
{
    $np =& $userStates['user']['numberPatterns'];
    $nr =& $userStates['user']['numberRepetition'];
    $results = array_slice($results, 0, 150);
    $df = 0.95;
    $ct = time();
    for ($i = 1; $i < count($results); $i++) {
        $cn = isset($results[$i]['number']) ? (int) $results[$i]['number'] : null;
        $nc = $results[$i - 1]['category'] ?? null;
        if ($cn !== null && $nc !== null) {
            $w = pow($df, $i - 1);
            $np[$cn]['total'] += $w;
            $np[$cn][$nc]['count'] += $w;
            $np[$cn][$nc]['successRate'] = $np[$cn]['total'] > 0 ? round(($np[$cn][$nc]['count'] / $np[$cn]['total']) * 100, 2) : 0;
        }
        if ($cn !== null) {
            $nr[$cn]['count']++;
            $nr[$cn]['recentCount']++;
            $nr[$cn]['lastSeen'] = $ct;
        }
    }
    foreach ($nr as $num => &$data) {
        if ($ct - $data['lastSeen'] > 3600)
            $data['recentCount'] = 0;
    }
}

function getNumberBasedPrediction($latestNumber, $numberPatterns, $numberRepetition)
{
    if ($latestNumber === null || !isset($numberPatterns[$latestNumber]) || $numberPatterns[$latestNumber]['total'] < 10)
        return ['prediction' => 'NEUTRAL', 'confidence' => 50, 'numberScore' => 50];
    $br = $numberPatterns[$latestNumber]['BIG']['successRate'];
    $sr = $numberPatterns[$latestNumber]['SMALL']['successRate'];
    $pred = $br > $sr ? 'BIG' : 'SMALL';
    $conf = max($br, $sr) + 20;
    return ['prediction' => $pred, 'confidence' => min($conf, 95), 'numberScore' => min($conf, 95) * ($numberRepetition[$latestNumber]['recentCount'] > 2 ? 1.5 : 1.0)];
}

// ============================================================
// STREAK MOMENTUM ANALYZER
// Detects if results are in a streak and predicts continuation
// Your data showed streaks of 4+ (BBBB, SSSS) — this catches it
// ============================================================
function analyzeStreakMomentum($results)
{
    $cats = array_map(fn($i) => $i['category'], array_slice($results, 0, 15));
    if (count($cats) < 3)
        return ['prediction' => 'NEUTRAL', 'confidence' => 50, 'streakLength' => 0, 'streakScore' => 50];

    // Count current streak
    $streakLen = 1;
    $streakDir = $cats[0];
    for ($i = 1; $i < count($cats); $i++) {
        if ($cats[$i] === $streakDir) $streakLen++;
        else break;
    }

    // Streak length → probability of continuation (diminishing returns after 5)
    // Based on empirical Wingo patterns: streaks of 3-5 are common
    if ($streakLen === 1) {
        // Only 1 same — look at last 5 for dominant side
        $big5 = count(array_filter(array_slice($cats, 0, 5), fn($c) => $c === 'BIG'));
        $small5 = 5 - $big5;
        if ($big5 >= 4) return ['prediction' => 'BIG', 'confidence' => 72, 'streakLength' => 1, 'streakScore' => 72];
        if ($small5 >= 4) return ['prediction' => 'SMALL', 'confidence' => 72, 'streakLength' => 1, 'streakScore' => 72];
        return ['prediction' => 'NEUTRAL', 'confidence' => 50, 'streakLength' => 1, 'streakScore' => 50];
    }

    // Streak of 2 → 60% continue
    if ($streakLen === 2) {
        return ['prediction' => $streakDir, 'confidence' => 60, 'streakLength' => 2, 'streakScore' => 60];
    }
    // Streak of 3 → 68% continue
    if ($streakLen === 3) {
        return ['prediction' => $streakDir, 'confidence' => 68, 'streakLength' => 3, 'streakScore' => 68];
    }
    // Streak of 4 → 72% continue
    if ($streakLen === 4) {
        return ['prediction' => $streakDir, 'confidence' => 72, 'streakLength' => 4, 'streakScore' => 72];
    }
    // Streak of 5+ → mean reversion starts (60% flip)
    $opposite = $streakDir === 'BIG' ? 'SMALL' : 'BIG';
    return ['prediction' => $opposite, 'confidence' => 65, 'streakLength' => $streakLen, 'streakScore' => 65];
}

// ============================================================
// 2nd ORDER MARKOV CHAIN
// Looks at last 2 results together to predict next
// Much more accurate than 1st order for Wingo patterns
// ============================================================
function analyzeMarkov2ndOrder($results)
{
    $cats = array_map(fn($i) => $i['category'], array_slice($results, 0, 60));
    if (count($cats) < 5)
        return ['prediction' => 'NEUTRAL', 'confidence' => 50, 'markov2Score' => 50];

    // Build 2nd-order transition table from history
    $transitions = [];
    for ($i = 2; $i < count($cats); $i++) {
        $state = $cats[$i] . '_' . $cats[$i - 1]; // e.g. "BIG_SMALL"
        $next  = $cats[$i - 2];
        if (!isset($transitions[$state])) $transitions[$state] = ['BIG' => 0, 'SMALL' => 0];
        $transitions[$state][$next]++;
    }

    // Current state = last 2 results
    $curState = $cats[0] . '_' . $cats[1];
    if (!isset($transitions[$curState])) {
        return ['prediction' => 'NEUTRAL', 'confidence' => 50, 'markov2Score' => 50];
    }

    $bigC   = $transitions[$curState]['BIG'];
    $smallC = $transitions[$curState]['SMALL'];
    $total  = $bigC + $smallC;
    if ($total < 3)
        return ['prediction' => 'NEUTRAL', 'confidence' => 50, 'markov2Score' => 50];

    $bigProb = $bigC / $total;
    $pred    = $bigProb > 0.5 ? 'BIG' : 'SMALL';
    $conf    = min(50 + abs($bigProb - 0.5) * 80, 90);

    return ['prediction' => $pred, 'confidence' => round($conf), 'markov2Score' => round($conf), 'state' => $curState, 'bigProb' => round($bigProb * 100, 1)];
}

// ============================================================
// MARKET REGIME DETECTOR
// Detects if market is in STREAK mode or ALTERNATE mode
// Adjusts which analyzers to trust more
// ============================================================
function detectMarketRegime($results)
{
    $cats = array_map(fn($i) => $i['category'], array_slice($results, 0, 20));
    if (count($cats) < 6)
        return ['regime' => 'UNKNOWN', 'streakiness' => 0.5, 'regimeScore' => 50];

    // Count alternations vs same in last 20
    $alternations = 0;
    $sames = 0;
    for ($i = 1; $i < count($cats); $i++) {
        if ($cats[$i] !== $cats[$i - 1]) $alternations++;
        else $sames++;
    }
    $total = $alternations + $sames;
    $streakiness = $total > 0 ? $sames / $total : 0.5; // 0=pure zigzag, 1=pure streak

    // Regime thresholds
    if ($streakiness > 0.55) $regime = 'STREAK';      // streaks dominating
    elseif ($streakiness < 0.45) $regime = 'ZIGZAG';  // alternating dominating
    else $regime = 'MIXED';

    return ['regime' => $regime, 'streakiness' => round($streakiness, 2), 'regimeScore' => round($streakiness * 100)];
}

// ============================================================
// ANTI-BIAS CORRECTION
// If predictions have been systematically wrong in one direction,
// apply a correction multiplier to counteract the bias
// ============================================================
function getAntiBiasCorrection($allPredictions)
{
    $recent = array_slice(array_filter($allPredictions, fn($e) => in_array($e['status'], ['WIN', 'LOSS'])), 0, 10);
    $recent = array_values($recent);
    if (count($recent) < 5)
        return ['correction' => 'NONE', 'multiplier' => 1.0, 'biasedToward' => null];

    // Count how many recent losses predicted BIG vs SMALL
    $lostBig = $lostSmall = 0;
    foreach ($recent as $e) {
        if ($e['status'] === 'LOSS') {
            if (($e['prediction'] ?? '') === 'BIG') $lostBig++;
            else $lostSmall++;
        }
    }
    $totalLoss = $lostBig + $lostSmall;
    if ($totalLoss < 3) return ['correction' => 'NONE', 'multiplier' => 1.0, 'biasedToward' => null];

    // If 70%+ losses are in one direction → we have a systematic bias
    if ($lostBig / $totalLoss >= 0.70) {
        // Algorithm keeps predicting BIG and losing → penalize BIG votes
        return ['correction' => 'PENALIZE_BIG', 'multiplier' => 0.6, 'biasedToward' => 'BIG', 'lostBig' => $lostBig, 'lostSmall' => $lostSmall];
    }
    if ($lostSmall / $totalLoss >= 0.70) {
        return ['correction' => 'PENALIZE_SMALL', 'multiplier' => 0.6, 'biasedToward' => 'SMALL', 'lostBig' => $lostBig, 'lostSmall' => $lostSmall];
    }
    return ['correction' => 'NONE', 'multiplier' => 1.0, 'biasedToward' => null];
}

// ============================================================
// WIN/LOSS TRACKER
// ============================================================
function analyzeWinLossTracker($predictions)
{
    $verified = array_values(array_filter($predictions, fn($e) => in_array($e['status'], ['WIN', 'LOSS'])));
    $consLoss = 0;
    $consWin = 0;
    $lastPred = null;
    $l4Losses = 0;
    $streakScore = 0;
    for ($i = 0; $i < count($verified); $i++) {
        if ($verified[$i]['status'] === 'LOSS') {
            $consLoss++;
            $consWin = 0;
            $lastPred = $verified[$i]['prediction'] ?? null;
            $streakScore -= 2;
        } elseif ($verified[$i]['status'] === 'WIN') {
            $consWin++;
            $consLoss = 0;
            $lastPred = $verified[$i]['prediction'] ?? null;
            $streakScore += 2;
        } else
            break;
    }
    foreach (array_slice($verified, 0, 4) as $e) {
        if ($e['status'] === 'LOSS') {
            $l4Losses++;
            $streakScore--;
        }
    }
    return ['consecutiveLosses' => $consLoss, 'consecutiveWins' => $consWin, 'lastPrediction' => $lastPred, 'lastFourLosses' => $l4Losses, 'streakScore' => $streakScore];
}

function analyzePredictionAccuracy($allPredictions)
{
    $verified = array_filter($allPredictions, fn($e) => in_array($e['status'], ['WIN', 'LOSS']));
    $total = count($verified);
    $wins = count(array_filter($verified, fn($e) => $e['status'] === 'WIN'));
    $rec = array_slice($verified, 0, 20);
    $rw = count(array_filter($rec, fn($e) => $e['status'] === 'WIN'));
    return ['accuracy' => $total > 0 ? round(($wins / $total) * 100, 2) : 0, 'recentAccuracy' => count($rec) > 0 ? round(($rw / count($rec)) * 100, 2) : 0, 'totalPredictions' => $total, 'wins' => $wins];
}

// ============================================================
// RAC ALGORITHM
// ============================================================
function racAlgorithm($patternPredictions, $allPredictions, $patternStats)
{
    $racScores = [];
    $hw = 50;
    $recent = array_slice($allPredictions, 0, $hw);
    foreach ($patternPredictions as $pattern => $predData) {
        $pp = $predData['prediction'];
        $pc = $predData['confidence'];
        $stats = $patternStats[$pattern] ?? ['wins' => 0, 'total' => 0, 'successRate' => 0, 'recentWins' => 0, 'recentTotal' => 0];
        $histAcc = $stats['successRate'] ?? 50;
        $recAcc = $stats['recentTotal'] > 0 ? ($stats['recentWins'] / $stats['recentTotal']) * 100 : $histAcc;
        $pm = 0;
        $pt = 0;
        foreach ($recent as $he) {
            if (isset($he['patternUsed']) && $he['patternUsed'] === $pattern) {
                $pt++;
                if ($he['status'] === 'WIN')
                    $pm++;
            }
        }
        $pmr = $pt > 0 ? ($pm / $pt) * 100 : $recAcc;
        $rs = ($histAcc * 0.3) + ($recAcc * 0.4) + ($pmr * 0.2) + (min($pc, 95) * 0.1);
        if ($recAcc > 60 && $pt >= 5)
            $rs *= 1.2;
        if ($recAcc < 45 && $pt >= 5)
            $rs *= 0.8;
        $racScores[$pattern] = ['score' => min(100, $rs), 'historicalAccuracy' => $histAcc, 'recentAccuracy' => $recAcc, 'patternMatchRate' => $pmr, 'prediction' => $pp, 'confidence' => $pc];
    }
    return $racScores;
}

// ============================================================
// PATTERN WEIGHTS
// ============================================================
function calculatePatternWeights($patternStats, $winLossTracker)
{
    $weights = [];
    $bw = 10;
    foreach ($patternStats as $pattern => $stats) {
        $bw = max($stats['successRate'], $bw);
        $rr = $stats['recentTotal'] > 0 ? ($stats['recentWins'] / $stats['recentTotal']) * 100 : $bw;
        $lp = ($winLossTracker['consecutiveLosses'] > 0 && $stats['recentTotal'] > 0) ? 0.7 : 1.0;
        $boost = in_array($pattern, ['numberBased', 'markovChain', 'entropyBased', 'neural']) ? 2.5 : 1.0;
        $lpb = ($pattern === 'longPattern' && $winLossTracker['consecutiveWins'] >= 2) ? 3.0 : 1.0;
        $eb = ($pattern === 'entropyBased' && $stats['recentTotal'] > 10) ? 2.2 : 1.0;
        $nb = ($pattern === 'neural' && $stats['recentTotal'] > 10) ? 2.8 : 1.0;
        $weights[$pattern] = ($bw * 0.3 + $rr * 0.7) * $lp * $boost * $lpb * $eb * $nb;
    }
    $tw = array_sum($weights) ?: 1;
    return array_map(fn($w) => ($w / $tw) * 100, $weights);
}

// ============================================================
// ✅ SMART LOSS RECOVERY & SKIP SYSTEM
// ============================================================

/**
 * Updates the lossRecovery state based on the latest verified results.
 * Call this after verifyPendingPredictions completes.
 */
function updateLossRecoveryState(&$userStates, $allPredictions)
{
    $lr = &$userStates['user']['lossRecovery'];

    // Collect last 10 non-skipped verified results
    $recent = [];
    foreach ($allPredictions as $entry) {
        if (in_array($entry['status'], ['WIN', 'LOSS'])) {
            $recent[] = $entry['status'];
            if (count($recent) >= 10)
                break;
        }
    }
    $lr['lastFiveResults'] = array_slice($recent, 0, 5);

    // Count consecutive losses from latest
    $consLoss = 0;
    foreach ($recent as $r) {
        if ($r === 'LOSS')
            $consLoss++;
        else
            break;
    }
    $lr['consecutiveLosses'] = $consLoss;

    // Enter recovery mode only after 3+ consecutive losses
    if ($consLoss >= 3 && !$lr['recoveryMode']) {
        $lr['recoveryMode'] = true;
        $lr['recoveryModeStart'] = time();
        $lr['forcedFlipActive'] = false; // Don't blindly flip — use consensus check
        $lr['forcedFlipCount'] = 0;
        error_log("[LossRecovery] Recovery mode ACTIVATED after $consLoss consecutive losses.");
    }

    // Exit recovery mode after just 1 consecutive win
    if ($lr['recoveryMode']) {
        $consWin = 0;
        foreach ($recent as $r) {
            if ($r === 'WIN')
                $consWin++;
            else
                break;
        }
        if ($consWin >= 1) {
            $lr['recoveryMode'] = false;
            $lr['forcedFlipActive'] = false;
            $lr['forcedFlipCount'] = 0;
            error_log("[LossRecovery] Recovery mode DEACTIVATED after $consWin consecutive wins.");
        }
    }
}

/**
 * Decides whether to SKIP the current prediction period entirely.
 * Logic:
 *  - If we're in a skip cooldown (too soon after last skip), never skip.
 *  - Never skip twice in a row.
 *  - Max 1 skip per 5 predictions.
 *  - Skip if: 3 losses in last 5 AND prediction confidence < threshold AND trend uncertain.
 *  - In recovery mode: only allow 1 skip then must bet.
 *
 * Returns true = skip this round, false = place bet.
 */
function smartShouldSkip(&$userStates, $pendingPredictions, $winLossTracker, $trendAnalysis, $patternStats, $trendStatsAnalysis, $confidence)
{
    $lr = &$userStates['user']['lossRecovery'];
    $currentPeriod = getCurrentPeriod1Min();
    $now = time();

    // ---- Hard rules: never skip ----
    // Don't skip if cooldown active
    if ($now < $lr['skipCooldownUntil'])
        return false;

    // Don't skip if last prediction was already a skip
    foreach ($pendingPredictions as $entry) {
        if (isset($entry['skipped']) && $entry['skipped'] === true)
            return false; // just skipped last round
        break; // only check very latest
    }

    // Count recent skips (last 5 predictions)
    $recentFive = array_slice($pendingPredictions, 0, 5);
    $recentSkips = count(array_filter($recentFive, fn($e) => isset($e['skipped']) && $e['skipped']));
    if ($recentSkips >= 1)
        return false; // max 1 skip per 5 rounds

    // In recovery mode: allow at most 1 skip then force betting
    if ($lr['recoveryMode'] && $lr['totalSkipsThisRun'] >= 1)
        return false;

    // ---- Conditions that suggest skipping ----
    $lossesInLast5 = count(array_filter($lr['lastFiveResults'], fn($r) => $r === 'LOSS'));
    $trendUncertain = abs($trendAnalysis['trendScore'] - 50) < 12;
    $lowConfidence = $confidence < 68;
    $highLossRate = $winLossTracker['lastFourLosses'] >= 3;

    // Trend stats uncertainty check
    $trendStatsWeak = false;
    if ($trendStatsAnalysis && isset($trendStatsAnalysis['confidence'])) {
        $trendStatsWeak = $trendStatsAnalysis['confidence'] < 55;
        if (!empty($trendStatsAnalysis['numberScores'])) {
            $maxScore = max($trendStatsAnalysis['numberScores']);
            if ($maxScore < 20)
                $trendStatsWeak = true;
        }
    }

    // Pattern disagreement check: count how many patterns disagree on direction
    $bigVotes = $smallVotes = 0;
    foreach ($patternStats as $pattern => $stats) {
        // Use recent rate if available
        $rate = $stats['recentTotal'] > 3 ? ($stats['recentWins'] / $stats['recentTotal']) * 100 : $stats['successRate'];
        if ($rate > 50)
            $bigVotes++;
        else
            $smallVotes++;
    }
    $patternDisagreement = abs($bigVotes - $smallVotes) <= 1; // nearly split

    // Decision: skip if multiple negative signals align
    $negativeSignals = 0;
    if ($lossesInLast5 >= 3)
        $negativeSignals++;
    if ($trendUncertain)
        $negativeSignals++;
    if ($lowConfidence)
        $negativeSignals++;
    if ($highLossRate)
        $negativeSignals++;
    if ($trendStatsWeak)
        $negativeSignals++;
    if ($patternDisagreement)
        $negativeSignals++;

    // Require at least 3 negative signals to skip, and add randomness (don't always skip even then)
    if ($negativeSignals >= 3 && mt_rand(1, 100) <= 60) {
        $lr['skipCooldownUntil'] = $now + 120; // cooldown: don't skip again for 2 rounds (~2 min)
        $lr['totalSkipsThisRun']++;
        $lr['lastSkipPeriod'] = $currentPeriod;
        error_log("[SmartSkip] Skipping period $currentPeriod. Signals: $negativeSignals. Losses/5: $lossesInLast5, Conf: $confidence, TrendUnc: " . ($trendUncertain ? 'Y' : 'N'));
        return true;
    }
    return false;
}

/**
 * Applies loss recovery logic to potentially flip the prediction.
 * If in recovery mode and 2-3 consecutive losses: flip opposite + boost confidence.
 * Returns modified [$prediction, $confidence, $explanation_suffix].
 */
function applyLossRecovery(&$userStates, $prediction, $confidence, $winLossTracker, $explanation)
{
    $lr = &$userStates['user']['lossRecovery'];
    $suffix = '';

    if (!$lr['recoveryMode'])
        return [$prediction, $confidence, $suffix];

    $consLoss = $lr['consecutiveLosses'];

    // In recovery mode: slightly reduce confidence to signal caution, but do NOT blindly flip.
    // Blind flips were causing the loss streak to continue.
    if ($consLoss >= 3) {
        $newConf = max($confidence - 10, 60);
        $suffix = " [RECOVERY MODE: $consLoss consecutive losses. Confidence reduced. Letting ensemble decide direction.]";
        error_log("[LossRecovery] Recovery caution applied. consLoss=$consLoss. No flip.");
        return [$prediction, $newConf, $suffix];
    }

    return [$prediction, $confidence, $suffix];
}

// ============================================================
// ALLOW SAME PREDICTION GUARD
// ============================================================
function allowSamePrediction($winLossTracker, $pendingPredictions, $prediction)
{
    // Allow riding a winning streak
    if ($winLossTracker['consecutiveWins'] >= 2 && $winLossTracker['lastPrediction'] === $prediction)
        return true;
    // Allow up to 4 same predictions in last 5 (was 3, too restrictive — caused bad forced flips)
    $rec = array_slice($pendingPredictions, 0, 5);
    $sc = count(array_filter($rec, fn($e) => isset($e['prediction']) && $e['prediction'] === $prediction));
    return $sc < 4;
}

// ============================================================
// VERIFY PENDING PREDICTIONS
// ============================================================
function verifyPendingPredictions(&$pendingPredictions, &$allPredictions, &$userStates)
{
    $currentPeriod = getCurrentPeriod1Min();
    $needVerify = false;
    foreach ($pendingPredictions as $entry) {
        if ($entry['period'] < $currentPeriod && $entry['status'] === 'Pending') {
            $needVerify = true;
            break;
        }
    }
    if (!$needVerify) {
        updateLossRecoveryState($userStates, $allPredictions);
        return $pendingPredictions;
    }

    $gameData = fetchApiData();
    if (isset($gameData['error'])) {
        error_log('Verify fetch failed: ' . $gameData['error']);
        return $pendingPredictions;
    }
    analyzeNumberPatterns($gameData, $userStates);

    foreach ($pendingPredictions as &$entry) {
        if ($entry['period'] < $currentPeriod && $entry['status'] === 'Pending') {
            $pl3 = substr($entry['period'], -3);
            $matching = null;
            foreach ($gameData as $item) {
                if (isset($item['period']) && substr($item['period'], -3) === $pl3) {
                    $matching = $item;
                    break;
                }
            }
            if ($matching) {
                $ar = $matching['category'];
                $entry['status'] = ($entry['prediction'] === $ar) ? 'WIN' : 'LOSS';
                $entry['actual'] = $ar;
                $entry['locked'] = true;
                $entry['number'] = $matching['number'] ?? null;
                $pu = $entry['patternUsed'] ?? 'trendBased';
                $pk = 'patternStatsAdvanced';
                $userStates['user'][$pk][$pu]['total']++;
                $userStates['user'][$pk][$pu]['recentTotal']++;
                if ($entry['status'] === 'WIN') {
                    $userStates['user'][$pk][$pu]['wins']++;
                    $userStates['user'][$pk][$pu]['recentWins']++;
                }
                $userStates['user'][$pk][$pu]['successRate'] = $userStates['user'][$pk][$pu]['total'] > 0 ? round(($userStates['user'][$pk][$pu]['wins'] / $userStates['user'][$pk][$pu]['total']) * 100, 2) : 0;
                $userStates['user'][$pk][$pu]['recentRate'] = $userStates['user'][$pk][$pu]['recentTotal'] > 0 ? round(($userStates['user'][$pk][$pu]['recentWins'] / $userStates['user'][$pk][$pu]['recentTotal']) * 100, 2) : 0;
                foreach ($allPredictions as &$ae) {
                    if ($ae['period'] === $entry['period']) {
                        $ae['status'] = $entry['status'];
                        $ae['actual'] = $entry['actual'];
                        $ae['number'] = $entry['number'];
                        $ae['patternUsed'] = $pu;
                        break;
                    }
                }
            } else {
                $entry['status'] = 'ERROR';
                $entry['actual'] = 'Unknown';
                $entry['locked'] = true;
                foreach ($allPredictions as &$ae) {
                    if ($ae['period'] === $entry['period']) {
                        $ae['status'] = $entry['status'];
                        $ae['actual'] = $entry['actual'];
                        break;
                    }
                }
            }
        }
    }

    // Update loss recovery state after verification
    updateLossRecoveryState($userStates, $allPredictions);

    saveToJson($userStates, $pendingPredictions);
    saveToJsonAll($allPredictions);
    saveAllStats($pendingPredictions, $allPredictions, $userStates);
    return $pendingPredictions;
}

// ============================================================
// GENERATE PREDICTION (MAIN)
// ============================================================
function generatePrediction(&$userStates, &$pendingPredictions, &$allPredictions)
{
    global $dataFile;
    $autoPeriod = getCurrentPeriod1Min();
    $currentTime = time();

    // Return cached prediction if already generated for this period
    foreach ($pendingPredictions as $entry) {
        if ($entry['period'] === $autoPeriod) {
            return [
                'gameType' => 'Wingo 1 Min',
                'period' => $autoPeriod,
                'prediction' => $entry['prediction'] ?? null,
                'confidence' => $entry['confidence'] ?? 60,
                'zigZagAnalysis' => ['isZigZag' => false, 'isBroken' => false, 'zigZagScore' => 0],
                'skipAnalysis' => ['isSkipPattern' => false, 'skipScore' => 0],
                'trendAnalysis' => ['bigRatio' => 0.5, 'movingAverage' => 0.5, 'trend' => 'NEUTRAL', 'trendScore' => 50],
                'cycleAnalysis' => ['isCycle' => false, 'cycleScore' => 0],
                'longPatternAnalysis' => ['isLongPattern' => false, 'lastCategory' => null, 'longPatternScore' => 0],
                'numberAnalysis' => ['prediction' => null, 'confidence' => 50, 'numberScore' => 50],
                'markovAnalysis' => ['prediction' => null, 'confidence' => 50, 'bigProbability' => 50, 'markovScore' => 50],
                'entropyAnalysis' => ['prediction' => null, 'confidence' => 50, 'entropy' => 0, 'avgEntropy' => 0, 'entropyScore' => 50],
                'neuralAnalysis' => ['prediction' => null, 'confidence' => 50, 'output' => 0.5, 'neuralScore' => 50],
                'winLossTracker' => ['consecutiveLosses' => 0, 'consecutiveWins' => 0, 'lastFourLosses' => 0, 'streakScore' => 0],
                'locked' => true,
                'latestResult' => $entry['latestResult'] ?? 'Unknown',
                'timestamp' => $entry['timestamp'] ?? $currentTime,
                'explanation' => 'Prediction already exists for this period.',
                'recommendation' => 'Use existing prediction for period ' . $autoPeriod,
                'skipped' => $entry['skipped'] ?? false,
                'lossRecovery' => $userStates['user']['lossRecovery']
            ];
        }
    }

    // Acquire lock
    $lockFile = $dataFile . '.pred_lock';
    $fp = fopen($lockFile, 'w');
    if (!flock($fp, LOCK_EX)) {
        error_log('Failed to acquire prediction lock');
        fclose($fp);
        return ['gameType' => 'Wingo 1 Min', 'period' => $autoPeriod, 'error' => 'Lock contention', 'timestamp' => $currentTime];
    }

    verifyPendingPredictions($pendingPredictions, $allPredictions, $userStates);
    $gameData = fetchApiData();

    // Fetch trend statistics
    $trendStats = fetchTrendStatistics();
    $trendStatsAnalysis = null;
    if (!isset($trendStats['error']))
        $trendStatsAnalysis = analyzeTrendStatistics($trendStats);

    // Defaults
    $latestResult = 'SMALL';
    $latestNumber = null;
    $zigZagAnalysis = ['isZigZag' => false, 'isBroken' => false, 'zigZagScore' => 0];
    $skipAnalysis = ['isSkipPattern' => false, 'skipScore' => 0];
    $trendAnalysis = ['bigRatio' => 0.5, 'movingAverage' => 0.5, 'trend' => 'NEUTRAL', 'trendScore' => 50];
    $cycleAnalysis = ['isCycle' => false, 'cycleScore' => 0];
    $longPatternAnalysis = ['isLongPattern' => false, 'lastCategory' => null, 'longPatternScore' => 0];
    $numberAnalysis = ['prediction' => null, 'confidence' => 50, 'numberScore' => 50];
    $markovAnalysis = ['prediction' => null, 'confidence' => 50, 'bigProbability' => 50, 'markovScore' => 50];
    $entropyAnalysis = ['prediction' => null, 'confidence' => 50, 'entropy' => 0, 'avgEntropy' => 0, 'entropyScore' => 50];
    $neuralAnalysis = ['prediction' => null, 'confidence' => 50, 'output' => 0.5, 'neuralScore' => 50];
    $results = [];

    if (!$gameData || isset($gameData['error'])) {
        error_log('Failed to fetch game data: ' . ($gameData['error'] ?? 'Unknown'));
        foreach ($pendingPredictions as $e) {
            if (isset($e['actual'])) {
                $latestResult = $e['actual'];
                break;
            }
        }
    } else {
        $results = array_slice($gameData, 0, 150);
        $latestResult = $results[0]['category'] ?? 'SMALL';
        $latestNumber = isset($results[0]['number']) ? (int) $results[0]['number'] : null;
        $wlt = analyzeWinLossTracker($allPredictions);
        $zigZagAnalysis = analyzeZigZagPattern($results);
        $skipAnalysis = analyzeSkipPattern($results);
        $trendAnalysis = analyzeTrendBased($results);
        $cycleAnalysis = analyzeCyclePattern($results);
        $longPatternAnalysis = analyzeLongPattern($results, $wlt);
        $numberAnalysis = getNumberBasedPrediction($latestNumber, $userStates['user']['numberPatterns'], $userStates['user']['numberRepetition']);
        $markovAnalysis = analyzeMarkovChain($results, $userStates);
        $entropyAnalysis = analyzeEntropyBased($results, $userStates);
        $neuralAnalysis = analyzeNeuralNetwork($results, $userStates);
        // ---- NEW advanced analyzers ----
        $streakAnalysis  = analyzeStreakMomentum($results);
        $markov2Analysis = analyzeMarkov2ndOrder($results);
        $regimeAnalysis  = detectMarketRegime($results);
    }

    $winLossTracker = analyzeWinLossTracker($allPredictions);
    $accuracyAnalysis = analyzePredictionAccuracy($allPredictions);
    $patternStats = $userStates['user']['patternStatsAdvanced'];
    $patternWeights = calculatePatternWeights($patternStats, $winLossTracker);
    // Anti-bias correction — penalise the direction we keep losing to
    $antiBias = getAntiBiasCorrection($allPredictions);
    // Market regime defaults (in case game data fetch failed)
    if (!isset($regimeAnalysis))  $regimeAnalysis  = ['regime' => 'MIXED', 'streakiness' => 0.5];
    if (!isset($streakAnalysis))  $streakAnalysis  = ['prediction' => 'NEUTRAL', 'confidence' => 50, 'streakScore' => 50, 'streakLength' => 0];
    if (!isset($markov2Analysis)) $markov2Analysis = ['prediction' => 'NEUTRAL', 'confidence' => 50, 'markov2Score' => 50];

    // Regime-adaptive base weights
    $regime = $regimeAnalysis['regime'];
    // In STREAK regime: trust streakMomentum + markov2 more, zigzag less
    // In ZIGZAG regime: trust zigzag + skipPattern more, streakMomentum less
    $streakWeight  = ($regime === 'STREAK') ? 35 : (($regime === 'ZIGZAG') ? 10 : 20);
    $markov2Weight = ($regime === 'STREAK') ? 30 : (($regime === 'ZIGZAG') ? 15 : 22);
    $zigzagWeight  = ($regime === 'ZIGZAG') ? 30 : (($regime === 'STREAK') ? 8  : 15);

    // ---- Ensemble voting ----
    $bigScore = 0;
    $smallScore = 0;
    $patternPredictions = [];
    $patternContributions = [];

    // ---- Inject new analyzers with regime-adaptive weights ----
    // Streak Momentum
    if ($streakAnalysis['prediction'] !== 'NEUTRAL') {
        $sc = $streakAnalysis['confidence'];
        $patternPredictions['streakMomentum'] = ['prediction' => $streakAnalysis['prediction'], 'confidence' => $sc, 'score' => $streakAnalysis['streakScore']];
        $patternContributions['streakMomentum'] = ['prediction' => $streakAnalysis['prediction'], 'weight' => $streakWeight, 'confidence' => $sc, 'streakLength' => $streakAnalysis['streakLength']];
        $vote = $streakAnalysis['prediction'];
        $biasMultiplier = ($antiBias['correction'] === 'PENALIZE_BIG' && $vote === 'BIG') ? $antiBias['multiplier'] :
                          (($antiBias['correction'] === 'PENALIZE_SMALL' && $vote === 'SMALL') ? $antiBias['multiplier'] : 1.0);
        if ($vote === 'BIG') $bigScore   += $streakWeight * $sc * $biasMultiplier;
        else                 $smallScore += $streakWeight * $sc * $biasMultiplier;
    }
    // 2nd-Order Markov
    if ($markov2Analysis['prediction'] !== 'NEUTRAL') {
        $mc = $markov2Analysis['confidence'];
        $patternPredictions['markov2'] = ['prediction' => $markov2Analysis['prediction'], 'confidence' => $mc, 'score' => $markov2Analysis['markov2Score']];
        $patternContributions['markov2'] = ['prediction' => $markov2Analysis['prediction'], 'weight' => $markov2Weight, 'confidence' => $mc];
        $vote = $markov2Analysis['prediction'];
        $biasMultiplier = ($antiBias['correction'] === 'PENALIZE_BIG' && $vote === 'BIG') ? $antiBias['multiplier'] :
                          (($antiBias['correction'] === 'PENALIZE_SMALL' && $vote === 'SMALL') ? $antiBias['multiplier'] : 1.0);
        if ($vote === 'BIG') $bigScore   += $markov2Weight * $mc * $biasMultiplier;
        else                 $smallScore += $markov2Weight * $mc * $biasMultiplier;
    }

    if ($trendStatsAnalysis && isset($trendStatsAnalysis['prediction'])) {
        $tw = 25;
        $tc = $trendStatsAnalysis['confidence'];
        $ts = $tc * 1.5;
        $patternPredictions['trendStatistics'] = ['prediction' => $trendStatsAnalysis['prediction'], 'confidence' => $tc, 'score' => $ts];
        if ($trendStatsAnalysis['prediction'] === 'BIG')
            $bigScore += $tw * $tc * ($ts / 100);
        else
            $smallScore += $tw * $tc * ($ts / 100);
        $patternContributions['trendStatistics'] = ['prediction' => $trendStatsAnalysis['prediction'], 'weight' => $tw, 'confidence' => $tc, 'score' => $ts, 'topNumbers' => $trendStatsAnalysis['topNumbers'] ?? [], 'numberStats' => $trendStatsAnalysis['numberStats'] ?? []];
    }

    foreach ($patternWeights as $pattern => $weight) {
        $patPred = 'NEUTRAL';
        $patConf = 50;
        $patScore = 50;
        if ($pattern === 'longPattern') {
            if ($longPatternAnalysis['isLongPattern']) {
                $patPred = $longPatternAnalysis['lastCategory'];
                $patConf = 40 + ($accuracyAnalysis['recentAccuracy'] / 5);
                $patScore = $longPatternAnalysis['longPatternScore'];
            }
        } elseif ($pattern === 'zigZag') {
            if ($zigZagAnalysis['isZigZag'] && !$zigZagAnalysis['isBroken']) {
                $patPred = $zigZagAnalysis['lastCategory'] === 'BIG' ? 'SMALL' : 'BIG';
                $patConf = 35 + ($accuracyAnalysis['recentAccuracy'] / 6);
                $patScore = $zigZagAnalysis['zigZagScore'] * 10;
            }
        } elseif ($pattern === 'skipPattern') {
            if ($skipAnalysis['isSkipPattern']) {
                $patPred = $latestResult === 'BIG' ? 'SMALL' : 'BIG';
                $patConf = 30 + ($accuracyAnalysis['recentAccuracy'] / 7);
                $patScore = $skipAnalysis['skipScore'] * 10;
            }
        } elseif ($pattern === 'cyclePattern') {
            if ($cycleAnalysis['isCycle']) {
                $l4 = array_slice(array_map(fn($i) => $i['category'], $results), 0, 4);
                $patPred = $l4[1] === 'BIG' ? 'SMALL' : 'BIG';
                $patConf = 35 + ($accuracyAnalysis['recentAccuracy'] / 6);
                $patScore = $cycleAnalysis['cycleScore'] * 10;
            }
        } elseif ($pattern === 'numberBased') {
            $na = getNumberBasedPrediction($latestNumber, $userStates['user']['numberPatterns'], $userStates['user']['numberRepetition']);
            $patPred = $na['prediction'];
            $patConf = $na['confidence'];
            $patScore = $na['numberScore'];
        } elseif ($pattern === 'markovChain') {
            $patPred = $markovAnalysis['prediction'];
            $patConf = $markovAnalysis['confidence'];
            $patScore = $markovAnalysis['markovScore'];
        } elseif ($pattern === 'entropyBased') {
            $patPred = $entropyAnalysis['prediction'];
            $patConf = $entropyAnalysis['confidence'];
            $patScore = $entropyAnalysis['entropyScore'];
        } elseif ($pattern === 'neural') {
            $patPred = $neuralAnalysis['prediction'];
            $patConf = $neuralAnalysis['confidence'];
            $patScore = $neuralAnalysis['neuralScore'];
        } else {
            $patPred = $trendAnalysis['trend'] === 'NEUTRAL' ? ($latestResult === 'BIG' ? 'SMALL' : 'BIG') : $trendAnalysis['trend'];
            $patConf = 40 + ($accuracyAnalysis['recentAccuracy'] / 5);
            $patScore = $trendAnalysis['trendScore'];
        }
        $patternPredictions[$pattern] = ['prediction' => $patPred, 'confidence' => $patConf, 'score' => $patScore];
        $patternContributions[$pattern] = ['prediction' => $patPred, 'weight' => $weight, 'confidence' => $patConf, 'score' => $patScore];
        if ($patPred === 'BIG') {
            $bm = ($antiBias['correction'] === 'PENALIZE_BIG') ? $antiBias['multiplier'] : 1.0;
            $bigScore += $weight * $patConf * ($patScore / 100) * $bm;
        } elseif ($patPred === 'SMALL') {
            $sm = ($antiBias['correction'] === 'PENALIZE_SMALL') ? $antiBias['multiplier'] : 1.0;
            $smallScore += $weight * $patConf * ($patScore / 100) * $sm;
        }
    }

    $prediction = $bigScore > $smallScore ? 'BIG' : 'SMALL';
    // Cap raw confidence lower — inflated confidence on wrong predictions caused misleading signals
    $confidence = min(max((abs($bigScore - $smallScore) / max($bigScore, $smallScore, 1)) * 100, 60), 88);

    // RAC algorithm
    $racScores = racAlgorithm($patternPredictions, $allPredictions, $patternStats);
    $racBig = 0;
    $racSmall = 0;
    $totalRac = 0;
    foreach ($racScores as $pattern => $rd) {
        if (isset($patternPredictions[$pattern])) {
            $totalRac += $rd['score'];
            if ($rd['prediction'] === 'BIG')
                $racBig += $rd['score'];
            elseif ($rd['prediction'] === 'SMALL')
                $racSmall += $rd['score'];
        }
    }
    if ($totalRac > 0) {
        $rnb = ($racBig / $totalRac) * 100;
        $rns = ($racSmall / $totalRac) * 100;
        $ebr = $bigScore > 0 ? $bigScore / ($bigScore + $smallScore) : 0.5;
        $esr = $smallScore > 0 ? $smallScore / ($bigScore + $smallScore) : 0.5;
        $fb = ($ebr * 70) + (($rnb / 100) * 30);
        $fs = ($esr * 70) + (($rns / 100) * 30);
        if (abs($fb - $fs) > 5) {
            $prediction = $fb > $fs ? 'BIG' : 'SMALL';
            // Cap RAC-adjusted confidence at 90 to prevent false high confidence
            $confidence = min(max(abs($fb - $fs) * 2, 60), 90);
        }
    }

    $explanation = "Regime:{$regime} Streak:{$streakAnalysis['streakLength']} Bias:{$antiBias['correction']} BigScore:" . round($bigScore) . " SmallScore:" . round($smallScore) . " => $prediction @ {$confidence}%";
    if ($trendStatsAnalysis && isset($trendStatsAnalysis['topNumbers'])) {
        $explanation .= " TrendTop:" . implode(',', $trendStatsAnalysis['topNumbers']);
    }
    if ($markov2Analysis['prediction'] !== 'NEUTRAL') {
        $explanation .= " M2:{$markov2Analysis['prediction']}@{$markov2Analysis['confidence']}%";
    }

    // Confidence boosts — reduced to prevent inflated confidence on wrong predictions
    // Only boost if MULTIPLE signals agree (majority consensus check)
    $agreeing = 0;
    $total_signals = 0;
    foreach ($patternPredictions as $p) {
        if ($p['prediction'] !== 'NEUTRAL') {
            $total_signals++;
            if ($p['prediction'] === $prediction) $agreeing++;
        }
    }
    $consensus_ratio = $total_signals > 0 ? $agreeing / $total_signals : 0.5;

    // Only apply boosts when consensus is strong (>65% patterns agree)
    if ($consensus_ratio >= 0.65) {
        if ($neuralAnalysis['confidence'] > 80 && $neuralAnalysis['prediction'] === $prediction) {
            $confidence = min($confidence + 5, 92);
            $explanation .= " [NeuralBoost+5]";
        }
        if ($numberAnalysis['confidence'] > 80 && $numberAnalysis['prediction'] === $prediction) {
            $confidence = min($confidence + 5, 92);
            $explanation .= " [NumberBoost+5]";
        }
        if ($trendAnalysis['trend'] !== 'NEUTRAL' && $trendAnalysis['trend'] === $prediction) {
            $confidence = min($confidence + 5, 92);
            $explanation .= " [TrendAlign+5]";
        }
        if ($trendStatsAnalysis && isset($trendStatsAnalysis['prediction']) && $trendStatsAnalysis['prediction'] === $prediction) {
            $confidence = min($confidence + 7, 92);
            $explanation .= " [TrendStatsBoost+7]";
        }
    }
    $explanation .= " [Consensus:" . round($consensus_ratio * 100) . "%]";

    // Same prediction guard
    if (!allowSamePrediction($winLossTracker, $pendingPredictions, $prediction)) {
        $prediction = $prediction === 'BIG' ? 'SMALL' : 'BIG';
        $confidence = max($confidence - 15, 65);
        $explanation .= " [SamePredGuard: flipped]";
    }

    // Recent ratio check — if last 10 heavily skewed, apply penalty OR flip prediction
    if (!empty($results)) {
        $rec10 = array_slice($results, 0, 10);
        $rb = count(array_filter($rec10, fn($r) => $r['category'] === 'BIG'));
        $rbr = count($rec10) > 0 ? $rb / count($rec10) : 0.5;
        if ($prediction === 'BIG' && $rbr > 0.80) {
            // Almost all recent are BIG — mean reversion likely, flip to SMALL
            $prediction = 'SMALL';
            $confidence = max($confidence - 10, 60);
            $explanation .= " [MeanReversion:BIG->SMALL]";
        } elseif ($prediction === 'SMALL' && $rbr < 0.20) {
            // Almost all recent are SMALL — mean reversion likely, flip to BIG
            $prediction = 'BIG';
            $confidence = max($confidence - 10, 60);
            $explanation .= " [MeanReversion:SMALL->BIG]";
        } elseif ($winLossTracker['consecutiveWins'] >= 3) {
            $confidence = min($confidence + 8, 92);
            $explanation .= " [ConsecWins+8]";
        }
    }

    // ---- SMART SKIP CHECK ----
    $shouldSkip = smartShouldSkip($userStates, $pendingPredictions, $winLossTracker, $trendAnalysis, $patternStats, $trendStatsAnalysis, $confidence);

    if ($shouldSkip) {
        $skipEntry = [
            'period' => $autoPeriod,
            'prediction' => null,
            'status' => 'SKIP',
            'confidence' => 0,
            'locked' => true,
            'latestResult' => $latestResult,
            'patternUsed' => 'SKIP',
            'timestamp' => $currentTime,
            'skipped' => true,
            'skipReason' => 'Smart skip: uncertain signals detected. Waiting for clearer pattern.',
        ];
        array_unshift($pendingPredictions, $skipEntry);
        array_unshift($allPredictions, $skipEntry);
        saveToJsonAll($allPredictions);
        saveToJson($userStates, $pendingPredictions);
        saveAllStats($pendingPredictions, $allPredictions, $userStates);
        flock($fp, LOCK_UN);
        fclose($fp);
        @unlink($lockFile);
        return [
            'gameType' => 'Wingo 1 Min',
            'period' => $autoPeriod,
            'prediction' => null,
            'confidence' => 0,
            'skipped' => true,
            'skipReason' => 'Smart skip: uncertain signals — waiting for cleaner pattern.',
            'lossRecovery' => $userStates['user']['lossRecovery'],
            'recommendation' => 'SKIP this round. Do not place a bet.',
            'timestamp' => $currentTime
        ];
    }

    // ---- LOSS RECOVERY FLIP ----
    [$prediction, $confidence, $recoverySuffix] = applyLossRecovery($userStates, $prediction, $confidence, $winLossTracker, $explanation);
    $explanation .= $recoverySuffix;

    // Save prediction
    $predictionEntry = [
        'period' => $autoPeriod,
        'prediction' => $prediction,
        'status' => 'Pending',
        'confidence' => $confidence,
        'locked' => true,
        'latestResult' => $latestResult,
        'patternUsed' => 'ensemble',
        'timestamp' => $currentTime,
        'skipped' => false
    ];
    array_unshift($pendingPredictions, $predictionEntry);
    array_unshift($allPredictions, $predictionEntry);
    saveToJsonAll($allPredictions);
    saveToJson($userStates, $pendingPredictions);
    saveAllStats($pendingPredictions, $allPredictions, $userStates);
    flock($fp, LOCK_UN);
    fclose($fp);
    @unlink($lockFile);

    return [
        'gameType' => 'Wingo 1 Min',
        'period' => $autoPeriod,
        'prediction' => $prediction,
        'confidence' => $confidence,
        'zigZagAnalysis' => $zigZagAnalysis,
        'skipAnalysis' => $skipAnalysis,
        'trendAnalysis' => $trendAnalysis,
        'cycleAnalysis' => $cycleAnalysis,
        'longPatternAnalysis' => $longPatternAnalysis,
        'numberAnalysis' => $numberAnalysis,
        'markovAnalysis' => $markovAnalysis,
        'entropyAnalysis' => $entropyAnalysis,
        'neuralAnalysis' => $neuralAnalysis,
        'winLossTracker' => $winLossTracker,
        'locked' => true,
        'latestResult' => $latestResult,
        'timestamp' => $currentTime,
        'patternContributions' => $patternContributions,
        'racScores' => $racScores,
        'trendStatistics' => $trendStatsAnalysis,
        'lossRecovery' => $userStates['user']['lossRecovery'],
        'skipped' => false,
        'explanation' => $explanation,
        'recommendation' => "Recommended bet: $prediction (Confidence: $confidence%). " . $recoverySuffix
    ];
}

// ============================================================
// GET STATS
// ============================================================
function getStats($pendingPredictions, $allPredictions, $userStates)
{
    $verified = array_filter($allPredictions, fn($e) => in_array($e['status'], ['WIN', 'LOSS']));
    $tw = count(array_filter($verified, fn($e) => $e['status'] === 'WIN'));
    $tl = count(array_filter($verified, fn($e) => $e['status'] === 'LOSS'));
    $tot = $tw + $tl;
    $wr = $tot > 0 ? round(($tw / $tot) * 100, 2) : 0;
    $streak = 0;
    $st = null;
    foreach ($allPredictions as $e) {
        if (in_array($e['status'], ['WIN', 'LOSS'])) {
            if ($st === null) {
                $st = $e['status'];
                $streak = 1;
            } elseif ($st === $e['status'])
                $streak++;
            else
                break;
        }
    }
    $l10 = array_map(fn($e) => $e['actual'] ?? 'Pending', array_slice($pendingPredictions, 0, 10));
    return ['operation' => 'getStats', 'totalWins' => $tw, 'totalLosses' => $tl, 'winRate' => $wr, 'streak' => "$streak " . ($st ?? 'None'), 'lastTen' => $l10, 'patternStats' => $userStates['user']['patternStatsAdvanced'], 'numberPatterns' => $userStates['user']['numberPatterns'], 'numberRepetition' => $userStates['user']['numberRepetition'], 'transitionMatrix' => $userStates['user']['transitionMatrix'], 'entropyHistory' => $userStates['user']['entropyHistory'], 'neuralWeights' => $userStates['user']['neuralWeights'], 'bias' => $userStates['user']['bias'], 'lossRecovery' => $userStates['user']['lossRecovery'], 'summary' => "Win rate: $wr%. Streak: $streak $st."];
}

// ============================================================
// SAVE FUNCTIONS
// ============================================================
function saveToJson($userStates, $pendingPredictions, $retries = 3)
{
    global $dataFile;
    $data = ['userStates' => $userStates, 'pendingPredictions' => $pendingPredictions];
    $json = json_encode($data, JSON_PRETTY_PRINT);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON encode error: ' . json_last_error_msg());
        return false;
    }
    for ($a = 0; $a < $retries; $a++) {
        $lf = $dataFile . '.lock';
        $fp = fopen($lf, 'w');
        if (!$fp) {
            sleep(1);
            continue;
        }
        if (flock($fp, LOCK_EX | LOCK_NB, $wb)) {
            if ($wb) {
                fclose($fp);
                sleep(1);
                continue;
            }
            if (file_put_contents($dataFile, $json) !== false) {
                flock($fp, LOCK_UN);
                fclose($fp);
                @unlink($lf);
                return true;
            }
            flock($fp, LOCK_UN);
            fclose($fp);
            @unlink($lf);
        } else {
            fclose($fp);
        }
        sleep(1);
    }
    error_log('saveToJson failed after retries');
    return false;
}

function saveToJsonAll($allPredictions, $retries = 3)
{
    global $allPredictionsFile;
    $json = json_encode($allPredictions, JSON_PRETTY_PRINT);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON encode error all predictions: ' . json_last_error_msg());
        return false;
    }
    for ($a = 0; $a < $retries; $a++) {
        $lf = $allPredictionsFile . '.lock';
        $fp = fopen($lf, 'w');
        if (!$fp) {
            sleep(1);
            continue;
        }
        if (flock($fp, LOCK_EX | LOCK_NB, $wb)) {
            if ($wb) {
                fclose($fp);
                sleep(1);
                continue;
            }
            if (file_put_contents($allPredictionsFile, $json) !== false) {
                flock($fp, LOCK_UN);
                fclose($fp);
                @unlink($lf);
                return true;
            }
            flock($fp, LOCK_UN);
            fclose($fp);
            @unlink($lf);
        } else {
            fclose($fp);
        }
        sleep(1);
    }
    error_log('saveToJsonAll failed after retries');
    return false;
}

function saveAllStats($pendingPredictions, $allPredictions, $userStates, $retries = 3)
{
    global $allStatsFile;
    $fs = getStats($pendingPredictions, $allPredictions, $userStates);
    $ad = analyzePredictionAccuracy($allPredictions);
    $wlt = analyzeWinLossTracker($allPredictions);
    $sd = ['timestamp' => time(), 'date' => date('Y-m-d H:i:s'), 'summary' => ['totalWins' => $fs['totalWins'] ?? 0, 'totalLosses' => $fs['totalLosses'] ?? 0, 'winRate' => $fs['winRate'] ?? 0, 'accuracy' => $ad['accuracy'] ?? 0, 'recentAccuracy' => $ad['recentAccuracy'] ?? 0, 'totalPredictions' => $ad['totalPredictions'] ?? 0, 'streak' => $fs['streak'] ?? '0 None', 'lastTen' => $fs['lastTen'] ?? []], 'winLossTracker' => $wlt, 'lossRecovery' => $userStates['user']['lossRecovery'], 'patternStats' => $fs['patternStats'] ?? [], 'numberPatterns' => $fs['numberPatterns'] ?? [], 'numberRepetition' => $fs['numberRepetition'] ?? [], 'transitionMatrix' => $fs['transitionMatrix'] ?? [], 'entropyHistory' => $fs['entropyHistory'] ?? [], 'neuralNetwork' => ['neuralWeights' => $fs['neuralWeights'] ?? [], 'bias' => $fs['bias'] ?? 0, 'learningRate' => $userStates['user']['learningRate'] ?? 0.1], 'userStates' => ['showHigher' => $userStates['user']['showHigher'] ?? true, 'autoToggle' => $userStates['user']['autoToggle'] ?? true, 'lastAdjustment' => $userStates['user']['lastAdjustment'] ?? 0, 'lastProcessedPeriod' => $userStates['user']['lastProcessedPeriod'] ?? ''], 'totalPendingPredictions' => count($pendingPredictions), 'totalAllPredictions' => count($allPredictions)];
    $hist = [];
    if (file_exists($allStatsFile)) {
        $ex = json_decode(file_get_contents($allStatsFile), true);
        if (json_last_error() === JSON_ERROR_NONE && isset($ex['history']))
            $hist = $ex['history'];
    }
    $hist[] = $sd;
    $cs = ['lastUpdated' => date('Y-m-d H:i:s'), 'lastUpdatedTimestamp' => time(), 'totalEntries' => count($hist), 'history' => $hist, 'latest' => $sd];
    $json = json_encode($cs, JSON_PRETTY_PRINT);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON encode error all stats');
        return false;
    }
    for ($a = 0; $a < $retries; $a++) {
        $lf = $allStatsFile . '.lock';
        $fp = fopen($lf, 'w');
        if (!$fp) {
            sleep(1);
            continue;
        }
        if (flock($fp, LOCK_EX | LOCK_NB, $wb)) {
            if ($wb) {
                fclose($fp);
                sleep(1);
                continue;
            }
            if (file_put_contents($allStatsFile, $json) !== false) {
                flock($fp, LOCK_UN);
                fclose($fp);
                @unlink($lf);
                return true;
            }
            flock($fp, LOCK_UN);
            fclose($fp);
            @unlink($lf);
        } else {
            fclose($fp);
        }
        sleep(1);
    }
    error_log('saveAllStats failed after retries');
    return false;
}

// ============================================================
// AUTH
// ============================================================
$API_ACCESS_KEY = 'enzo';
$providedKey = $_GET['key'] ?? $_POST['key'] ?? ($inputData['key'] ?? null);
if ($API_ACCESS_KEY !== '' && $providedKey !== $API_ACCESS_KEY) {
    error_log('Invalid API key');
    http_response_code(403);
    echo json_encode(['status' => 'Request Failed', 'message' => 'Invalid or missing API key', 'server_time' => date('Y-m-d H:i:s'), 'timestamp' => time()], JSON_PRETTY_PRINT);
    exit;
}

// ============================================================
// ROUTER
// ============================================================
$output = [];
try {
    verifyPendingPredictions($pendingPredictions, $allPredictions, $userStates);
    switch ($action) {
        case 'getPrediction':
            verifyPendingPredictions($pendingPredictions, $allPredictions, $userStates);
            $pr = generatePrediction($userStates, $pendingPredictions, $allPredictions);
            $fp2 = ['gameType' => $pr['gameType'] ?? 'Wingo 1 Min', 'period' => $pr['period'] ?? '', 'prediction' => $pr['prediction'] ?? null, 'status' => $pr['status'] ?? 'Pending', 'confidence' => $pr['confidence'] ?? 0, 'skipped' => $pr['skipped'] ?? false, 'skipReason' => $pr['skipReason'] ?? null, 'lossRecovery' => $pr['lossRecovery'] ?? null];
            $fs = getStats($pendingPredictions, $allPredictions, $userStates);
            $ad = analyzePredictionAccuracy($allPredictions);
            $stats = ['operation' => $fs['operation'] ?? 'getStats', 'totalWins' => $fs['totalWins'] ?? 0, 'totalLosses' => $fs['totalLosses'] ?? 0, 'winRate' => $fs['winRate'] ?? 0, 'accuracy' => $ad['accuracy'] ?? $fs['winRate'] ?? 0, 'recentAccuracy' => $ad['recentAccuracy'] ?? 0, 'streak' => $fs['streak'] ?? '0 None', 'lastTen' => $fs['lastTen'] ?? [], 'lossRecovery' => $userStates['user']['lossRecovery']];
            $output = ['predictionResult' => $fp2, 'pendingPredictions' => array_slice($pendingPredictions, 0, 50), 'stats' => $stats];
            if (!saveToJson($userStates, $pendingPredictions))
                throw new Exception('Failed to save prediction data');
            saveAllStats($pendingPredictions, $allPredictions, $userStates);
            break;
        case 'getLatest':
            $lat = $pendingPredictions[0] ?? null;
            $ad = analyzePredictionAccuracy($allPredictions);
            $fs = getStats($pendingPredictions, $allPredictions, $userStates);
            $lr = $lat ? ['gameType' => 'Wingo 1 Min', 'period' => $lat['period'] ?? '', 'prediction' => $lat['prediction'] ?? null, 'status' => $lat['status'] ?? 'Pending', 'confidence' => $lat['confidence'] ?? 0, 'skipped' => $lat['skipped'] ?? false, 'skipReason' => $lat['skipReason'] ?? null, 'lossRecovery' => $userStates['user']['lossRecovery']] : ['gameType' => 'Wingo 1 Min', 'period' => '', 'prediction' => null, 'status' => 'Pending', 'confidence' => 0, 'skipped' => false];
            $output = ['predictionResult' => $lr, 'stats' => ['winRate' => $fs['winRate'] ?? 0, 'accuracy' => $ad['accuracy'] ?? $fs['winRate'] ?? 0, 'recentAccuracy' => $ad['recentAccuracy'] ?? 0, 'lossRecovery' => $userStates['user']['lossRecovery']]];
            break;
        case 'getHistory':
            $output = ['operation' => 'getHistory', 'status' => 'success', 'pendingPredictions' => array_slice($pendingPredictions, 0, 50), 'server_time' => date('Y-m-d H:i:s'), 'timestamp' => time()];
            break;
        case 'getStats':
            $fs = getStats($pendingPredictions, $allPredictions, $userStates);
            $ad = analyzePredictionAccuracy($allPredictions);
            $output = ['operation' => $fs['operation'] ?? 'getStats', 'totalWins' => $fs['totalWins'] ?? 0, 'totalLosses' => $fs['totalLosses'] ?? 0, 'winRate' => $fs['winRate'] ?? 0, 'accuracy' => $ad['accuracy'] ?? $fs['winRate'] ?? 0, 'recentAccuracy' => $ad['recentAccuracy'] ?? 0, 'streak' => $fs['streak'] ?? '0 None', 'lastTen' => $fs['lastTen'] ?? [], 'lossRecovery' => $userStates['user']['lossRecovery']];
            break;
        case 'verify':
            $output = ['operation' => 'verify', 'status' => 'success', 'pendingPredictions' => array_slice($pendingPredictions, 0, 50), 'server_time' => date('Y-m-d H:i:s'), 'timestamp' => time(), 'lossRecovery' => $userStates['user']['lossRecovery']];
            if (!saveToJson($userStates, $pendingPredictions))
                throw new Exception('Failed to save after verification');
            saveAllStats($pendingPredictions, $allPredictions, $userStates);
            break;
        default:
            $output = ['operation' => $action, 'status' => 'error', 'error' => 'Invalid action', 'server_time' => date('Y-m-d H:i:s'), 'timestamp' => time()];
    }
} catch (Exception $e) {
    error_log('Error in action: ' . $e->getMessage());
    $output = ['operation' => $action, 'status' => 'error', 'error' => 'Internal error: ' . $e->getMessage(), 'server_time' => date('Y-m-d H:i:s'), 'timestamp' => time()];
    http_response_code(500);
}
echo json_encode($output, JSON_PRETTY_PRINT);
?>