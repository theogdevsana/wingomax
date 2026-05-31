/**
 * Security utilities for input validation and sanitization
 * Prevents NoSQL injection, XSS, and other common attacks
 */

/**
 * Sanitizes strings to prevent NoSQL injection attacks
 * Removes or escapes special MongoDB operators and dangerous characters
 */
export function sanitizeInput(input: any): any {
  if (input === null || input === undefined) {
    return input;
  }

  // Handle strings
  if (typeof input === 'string') {
    // Remove or escape dangerous MongoDB operators
    const operators = ['$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$or', '$and', '$not', '$nor', '$regex', '$where', '$elemMatch', '$exists', '$type', '$mod', '$text', '$jsonSchema'];
    let sanitized = input.trim();
    
    // Check for operator patterns
    operators.forEach(op => {
      const pattern = new RegExp(`^\\s*${op.replace('$', '\\$')}\\s*:`, 'i');
      if (pattern.test(sanitized)) {
        throw new Error(`Invalid input: Contains MongoDB operator ${op}`);
      }
    });

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');
    
    return sanitized;
  }

  // Handle objects - recursively sanitize
  if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
    const sanitized: any = {};
    for (const key in input) {
      // Check for dangerous keys (MongoDB operators)
      if (key.startsWith('$') || key.startsWith('.')) {
        throw new Error(`Invalid input: Contains dangerous key ${key}`);
      }
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }

  // Handle arrays
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }

  // Return other types as-is (numbers, booleans)
  return input;
}

/**
 * Validates email format to prevent email injection
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates license key format
 * Accepts alphanumeric with hyphens and underscores
 */
export function validateLicenseKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  if (key.length < 10 || key.length > 255) return false;
  // Only allow alphanumeric, hyphens, and underscores
  return /^[a-zA-Z0-9_-]+$/.test(key);
}

/**
 * Validates device ID format
 */
export function validateDeviceId(deviceId: string): boolean {
  if (!deviceId || typeof deviceId !== 'string') return false;
  if (deviceId.length < 5 || deviceId.length > 50) return false;
  // Only allow alphanumeric and underscores/hyphens
  return /^[a-zA-Z0-9_-]+$/.test(deviceId);
}

/**
 * Validates username format
 */
export function validateUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false;
  if (username.length < 3 || username.length > 50) return false;
  // Only allow alphanumeric, underscores, hyphens, dots
  return /^[a-zA-Z0-9._-]+$/.test(username);
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 6 || password.length > 255) return false;
  return true;
}

/**
 * Removes or escapes XSS-dangerous characters for display
 */
export function sanitizeForDisplay(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Checks if input string looks like a MongoDB query injection attempt
 */
export function isLikelyInjectionAttempt(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  // Check for common injection patterns
  const suspiciousPatterns = [
    /^\s*\{.*\}/,  // JSON-like objects
    /\$\w+\s*:/,   // MongoDB operators
    /["'`]/,       // Quotes that might escape context
    /[;\n\r]/,     // SQL-like terminators
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Main function to validate and sanitize login credentials
 */
export function validateLoginCredentials(
  username: string, 
  password: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for empty values
  if (!username || !password) {
    errors.push('Username and password are required');
    return { valid: false, errors };
  }

  // Check for injection attempts
  if (isLikelyInjectionAttempt(username) || isLikelyInjectionAttempt(password)) {
    errors.push('Invalid credentials format');
    return { valid: false, errors };
  }

  // Validate username format
  if (!validateUsername(username)) {
    errors.push('Invalid username format');
  }

  // Validate password length
  if (!validatePassword(password)) {
    errors.push('Invalid password format');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Main function to validate and sanitize license key login
 */
export function validateLicenseLogin(
  key: string,
  device_id: string
): { valid: boolean; errors: string[]; sanitized?: { key: string; device_id: string } } {
  const errors: string[] = [];

  // Check for empty values
  if (!key || !device_id) {
    errors.push('Key and Device ID are required');
    return { valid: false, errors };
  }

  // Check for injection attempts
  if (isLikelyInjectionAttempt(key) || isLikelyInjectionAttempt(device_id)) {
    errors.push('Invalid credentials format');
    return { valid: false, errors };
  }

  // Validate formats
  if (!validateLicenseKey(key)) {
    errors.push('Invalid license key format');
  }

  if (!validateDeviceId(device_id)) {
    errors.push('Invalid device ID format');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize the inputs
  try {
    const sanitized = {
      key: sanitizeInput(key),
      device_id: sanitizeInput(device_id)
    };

    return {
      valid: true,
      errors: [],
      sanitized
    };
  } catch (err) {
    return {
      valid: false,
      errors: ['Invalid input format']
    };
  }
}
