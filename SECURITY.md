# Login Security Implementation

## Overview
This document outlines the security measures implemented for both user and admin login systems to prevent NoSQL injection, XSS attacks, brute force attempts, and other common security vulnerabilities.

## Security Features Implemented

### 1. **Input Validation & Sanitization** (`src/lib/security.ts`)

#### NoSQL Injection Prevention
- **Operator Detection**: Detects and blocks MongoDB operators (`$ne`, `$gt`, `$in`, `$or`, etc.)
- **Structure Validation**: Prevents object-based queries that might contain operators
- **Character Whitelisting**: Only allows specific safe characters for each field type

#### XSS Prevention
- **Format Validation**: Validates input formats to prevent injection of script payloads
- **Display Sanitization**: HTML-encodes special characters for safe display
- **Input Length Limits**: Enforces reasonable length limits on all inputs

#### Field-Specific Validation

**License Key Validation:**
- Format: Alphanumeric, hyphens, underscores only
- Length: 10-255 characters
- Prevents: NoSQL injection, XSS, command injection

**Device ID Validation:**
- Format: Alphanumeric, hyphens, underscores only
- Length: 5-50 characters
- Prevents: Manipulation of device binding

**Username Validation:**
- Format: Alphanumeric, dots, hyphens, underscores only
- Length: 3-50 characters
- Prevents: Special character injection

**Password Validation:**
- Length: 6-255 characters
- Prevents: Null bytes, control characters

### 2. **Rate Limiting** (`src/lib/rate-limiter.ts`)

Prevents brute force attacks with configurable limits:

- **License Login**: 5 attempts per 15 minutes per IP
- **Admin Login**: 5 attempts per 15 minutes per IP
- **Username-based**: 10 attempts per hour per username

#### Rate Limiter Features:
- In-memory storage with automatic cleanup
- Returns retry-after header (HTTP 429)
- Resets on successful login
- Per-IP rate limiting to block distributed attacks

### 3. **Backend Security (Login Endpoints)**

#### User Login (`src/app/v1/login/route.ts`)
1. ✅ IP-based rate limiting check
2. ✅ Validates input format and structure
3. ✅ Sanitizes inputs to prevent injection
4. ✅ Safe database query with sanitized key
5. ✅ Device binding validation
6. ✅ Token generation with secure settings
7. ✅ Cookie set with `httpOnly`, `secure`, `SameSite=Lax`
8. ✅ Rate limiter reset on success
9. ✅ No information leakage in error messages

#### Admin Login (`src/app/v1/admin/login/route.ts`)
1. ✅ IP-based rate limiting check
2. ✅ Validates username and password format
3. ✅ Detects injection attempts in credentials
4. ✅ Sanitizes username before database query
5. ✅ Secure password comparison
6. ✅ Generic error messages (doesn't reveal if username exists)
7. ✅ Rate limiter reset on success
8. ✅ Secure cookie configuration

### 4. **Frontend Security (Client-side Validation)**

#### License Login (`src/components/LoginForm.tsx` & `src/app/LoginClient.tsx`)
- ✅ Validates license key format before API call
- ✅ User-friendly error messages
- ✅ Prevents submission of invalid data

#### Admin Login (`src/app/admin/login/page.tsx`)
- ✅ Validates credentials format before API call
- ✅ Checks for injection patterns
- ✅ Provides helpful error feedback

## Protected Attack Vectors

### 1. NoSQL Injection
**Example Attack Attempt:**
```javascript
// Would try to bypass with:
{ key: { $ne: null }, device_id: "..." }
// OR
{ key: '{"$ne":null}', device_id: "..." }
```
**Protection:** Sanitized inputs, operator detection, format validation

### 2. Cross-Site Scripting (XSS)
**Example Attack Attempt:**
```javascript
{ key: '<img src=x onerror="alert(1)">', device_id: "..." }
```
**Protection:** Character whitelisting, format validation, HTML encoding

### 3. Brute Force Attack
**Example Attack:**
```
Multiple login attempts in rapid succession
```
**Protection:** Rate limiting (5 attempts per 15 minutes per IP), automatic cleanup

### 4. Account Enumeration
**Example Attack:**
```
Test different usernames to see which ones exist
```
**Protection:** Generic error messages that don't reveal user existence

### 5. SQL/Command Injection
**Protection:** No raw queries, parameterized database operations

## Security Best Practices Implemented

✅ **Input Validation**: Whitelist approach (only allow known good patterns)
✅ **Rate Limiting**: Prevent brute force and DoS attacks
✅ **Secure Headers**: `httpOnly`, `secure`, `SameSite` cookies
✅ **Error Handling**: Generic messages to prevent information leakage
✅ **Logging**: Errors logged server-side for debugging
✅ **CORS**: Proper CORS configuration on API routes
✅ **HTTPS Only**: Secure cookies in production
✅ **Session Management**: 2-hour session for users, 24-hour for admin

## Database Query Safety

### Current Implementation
All database queries use sanitized inputs with MongoDB operators blocked:

```typescript
// SAFE - sanitized input
const license = await License.findOne({ key: sanitized.key });

// BLOCKED - would be caught by validation
const malicious = await License.findOne({ key: { $ne: null } });
```

## Future Security Enhancements

1. **CAPTCHA Integration**: Add CAPTCHA after failed login attempts
2. **Two-Factor Authentication**: Additional security for admin accounts
3. **Login Attempt Logging**: Store failed attempts for audit trail
4. **IP Whitelisting**: Optional feature for admin accounts
5. **Bcrypt Password Hashing**: Upgrade from SHA256 to bcrypt for admin passwords
6. **JWT Token Expiry**: Implement short-lived tokens with refresh tokens
7. **CSRF Protection**: Add CSRF tokens for state-changing operations
8. **Security Headers**: Add CSP, X-Frame-Options, etc.

## Testing the Security

### Test Cases
1. **NoSQL Injection Test:**
   ```bash
   curl -X POST http://localhost:3000/v1/login \
     -H "Content-Type: application/json" \
     -d '{"key":{"$ne":null},"device_id":"dev_123"}'
   # Expected: 400 Bad Request - "Invalid input format"
   ```

2. **Rate Limiting Test:**
   ```bash
   # Run 6 sequential login attempts
   for i in {1..6}; do
     curl -X POST http://localhost:3000/v1/login \
       -H "Content-Type: application/json" \
       -d '{"key":"invalid_key_'$i'","device_id":"dev_'$i'"}'
   done
   # Expected: 6th request gets 429 Too Many Requests
   ```

3. **XSS Test:**
   ```bash
   curl -X POST http://localhost:3000/v1/login \
     -H "Content-Type: application/json" \
     -d '{"key":"<img src=x onerror=alert(1)>","device_id":"dev_123"}'
   # Expected: 400 Bad Request - Invalid format
   ```

## Configuration Reference

### Rate Limiter Settings
```typescript
// License Login: 5 attempts per 15 minutes
const licenseLoginLimiter = new RateLimiter(5, 15 * 60 * 1000);

// Admin Login: 5 attempts per 15 minutes
const adminLoginLimiter = new RateLimiter(5, 15 * 60 * 1000);
```

### Cookie Settings
```typescript
{
  httpOnly: true,           // Can't be accessed by JavaScript
  secure: true,            // Only sent over HTTPS in production
  sameSite: 'lax',         // Prevents CSRF attacks
  path: '/',
  domain: '.wingosignals.xyz',  // Production only
  maxAge: 2 * 60 * 60      // 2 hours for user, 24 for admin
}
```

## Security Response Codes

| Code | Scenario |
|------|----------|
| 200 | Successful login |
| 400 | Invalid input format or validation failed |
| 401 | Invalid credentials |
| 403 | License expired, banned, or device mismatch |
| 429 | Rate limit exceeded - too many login attempts |
| 500 | Server error (generic, no details leaked) |

## References & Standards

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- NoSQL Injection: https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Injection_Cheat_Sheet.html
- Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

---

**Last Updated**: May 31, 2026
**Version**: 1.0
