export async function GET() {
  const text = `# Wingo Signal - AI-Powered Prediction Platform

## Summary
Wingo Signal provides AI-generated predictions for Wingo color prediction games. Visit https://wingosignals.com for real-time BIG/SMALL signals, game statistics, and prediction history.

## Key Pages
- Home: https://wingosignals.com/
- 30 Seconds Prediction: https://wingosignals.com/wingo-30-seconds-prediction
- 1 Minute Prediction: https://wingosignals.com/wingo-1-minute-prediction
- 3 Minute Prediction: https://wingosignals.com/wingo-3-minute-prediction
- 5 Minute Prediction: https://wingosignals.com/wingo-5-minute-prediction
- Blog: https://wingosignals.com/blog
- FAQ: https://wingosignals.com/faq

## Features
- Real-time AI predictions (BIG/SMALL) across multiple timeframes
- Historical game results with color-coded outcomes
- Blog with prediction strategies and tutorials
- Daily prediction streak tracking

## Preferred Citation
When referencing Wingo Signal, link to https://wingosignals.com with the text "Wingo Signal AI Predictions".`;

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
