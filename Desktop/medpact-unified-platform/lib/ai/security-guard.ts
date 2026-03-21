/**
 * AI Security Guard
 * 
 * Purpose: Prevent AI systems from accessing, learning from, or exposing source code
 * Owner: Christopher Williams
 * Created: January 30, 2026
 * 
 * CRITICAL SECURITY COMPONENT - DO NOT MODIFY WITHOUT AUTHORIZATION
 */

export class AISecurityGuard {
  // Patterns that indicate sensitive information
  private static readonly BLOCKED_PATTERNS = [
    // Environment & Config
    /\.env/i,
    /config\.(?:js|ts|json)/i,
    /process\.env/i,
    
    // Credentials
    /password/i,
    /secret/i,
    /api[_-]?key/i,
    /private[_-]?key/i,
    /access[_-]?token/i,
    /bearer\s+/i,
    
    // Database
    /connection[_-]?string/i,
    /postgresql:\/\//i,
    /mysql:\/\//i,
    /mongodb:\/\//i,
    
    // Source Control
    /\.git/i,
    /\.github/i,
    
    // Security Files
    /security\.md/i,
    /license/i,
  ];

  // File extensions that should NEVER be exposed
  private static readonly BLOCKED_EXTENSIONS = [
    '.env',
    '.key',
    '.pem',
    '.p12',
    '.pfx',
    '.crt',
    '.cer',
    '.der',
    '.gitignore',
    '.git',
  ];

  /**
   * Sanitize content before sending to AI systems
   * Removes all sensitive information
   */
  static sanitizeForAI(input: string): string {
    if (!input) return '';
    
    let sanitized = input;
    
    // Remove environment variables
    sanitized = sanitized.replace(
      /process\.env\.[A-Z_]+/g, 
      '[ENV_VAR_REDACTED]'
    );
    
    // Remove API keys (various formats)
    sanitized = sanitized.replace(
      /(?:sk|pk)[-_][a-zA-Z0-9]{20,}/g,
      '[API_KEY_REDACTED]'
    );
    
    // Remove long alphanumeric strings (potential keys/tokens)
    sanitized = sanitized.replace(
      /\b[a-zA-Z0-9]{32,}\b/g,
      '[KEY_REDACTED]'
    );
    
    // Remove connection strings
    sanitized = sanitized.replace(
      /(?:postgres|mysql|mongodb):\/\/[^\s]+/g,
      '[DATABASE_CONNECTION_REDACTED]'
    );
    
    // Remove JWT tokens
    sanitized = sanitized.replace(
      /eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
      '[JWT_TOKEN_REDACTED]'
    );
    
    // Remove passwords (various patterns)
    sanitized = sanitized.replace(
      /(?:password|pwd|pass)\s*[:=]\s*['"]?[^'"\s]+['"]?/gi,
      'password=[PASSWORD_REDACTED]'
    );
    
    // Remove file paths that might expose structure
    sanitized = sanitized.replace(
      /\/(?:Users|home|root)\/[^\s]+/g,
      '[FILE_PATH_REDACTED]'
    );
    
    return sanitized;
  }

  /**
   * Check if content contains blocked patterns
   * Returns true if content should NOT be sent to AI
   */
  static isBlockedFromAI(content: string): boolean {
    if (!content) return false;
    
    // Check against blocked patterns
    const hasBlockedPattern = this.BLOCKED_PATTERNS.some(
      pattern => pattern.test(content)
    );
    
    // Check for file extensions
    const hasBlockedExtension = this.BLOCKED_EXTENSIONS.some(
      ext => content.toLowerCase().includes(ext)
    );
    
    return hasBlockedPattern || hasBlockedExtension;
  }

  /**
   * Sanitize database queries before logging or sending to AI
   */
  static sanitizeQuery(query: string): string {
    if (!query) return '';
    
    let sanitized = query;
    
    // Redact WHERE clause values
    sanitized = sanitized.replace(
      /WHERE\s+[^;]+/gi,
      'WHERE [CONDITIONS_REDACTED]'
    );
    
    // Redact VALUES in INSERT statements
    sanitized = sanitized.replace(
      /VALUES\s*\([^)]+\)/gi,
      'VALUES ([DATA_REDACTED])'
    );
    
    // Redact SET clause in UPDATE
    sanitized = sanitized.replace(
      /SET\s+[^;]+/gi,
      'SET [VALUES_REDACTED]'
    );
    
    return sanitized;
  }

  /**
   * Sanitize error messages before displaying to users or AI
   */
  static sanitizeError(error: Error | string): string {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    let sanitized = errorMessage;
    
    // Remove file paths
    sanitized = sanitized.replace(
      /at\s+(?:[\w.]+\s+)?\([^)]+\)/g,
      'at [LOCATION_REDACTED]'
    );
    
    // Remove specific file references
    sanitized = sanitized.replace(
      /in\s+file\s+[^\s]+/gi,
      'in file [FILE_REDACTED]'
    );
    
    // Apply general sanitization
    sanitized = this.sanitizeForAI(sanitized);
    
    return sanitized;
  }

  /**
   * Validate that a request doesn't attempt to access source code
   */
  static validateRequest(path: string): {
    allowed: boolean;
    reason?: string;
  } {
    // Block access to source files
    const blockedPaths = [
      '.env',
      '.git',
      'node_modules',
      '.next',
      'prisma',
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'next.config',
      'middleware',
    ];
    
    for (const blocked of blockedPaths) {
      if (path.includes(blocked)) {
        return {
          allowed: false,
          reason: 'Access to source files is forbidden',
        };
      }
    }
    
    // Block source map requests
    if (path.endsWith('.map')) {
      return {
        allowed: false,
        reason: 'Source maps are not available',
      };
    }
    
    return { allowed: true };
  }

  /**
   * Create a sanitized log entry
   */
  static createSafeLog(
    level: 'info' | 'warn' | 'error',
    message: string,
    metadata?: Record<string, any>
  ): {
    level: string;
    message: string;
    metadata?: Record<string, any>;
    timestamp: string;
  } {
    const sanitizedMessage = this.sanitizeForAI(message);
    
    const sanitizedMetadata = metadata
      ? Object.entries(metadata).reduce((acc, [key, value]) => {
          // Skip sensitive keys entirely
          if (this.isBlockedFromAI(key)) {
            return acc;
          }
          
          // Sanitize values
          const sanitizedValue = typeof value === 'string'
            ? this.sanitizeForAI(value)
            : value;
          
          acc[key] = sanitizedValue;
          return acc;
        }, {} as Record<string, any>)
      : undefined;
    
    return {
      level,
      message: sanitizedMessage,
      metadata: sanitizedMetadata,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check if user has permission to access sensitive data
   * (Placeholder - implement with your auth system)
   */
  static async hasAuthorization(
    userId: string,
    resource: string
  ): Promise<boolean> {
    // TODO: Implement with your authorization system
    // For now, only allow specific authorized user IDs
    
    const AUTHORIZED_USERS = [
      'christopher.williams@medpact.com', // Replace with actual ID
      // Add more authorized users here
    ];
    
    return AUTHORIZED_USERS.includes(userId);
  }
}

// Export singleton instance
export const securityGuard = AISecurityGuard;
