# 🔒 CODE SECURITY & PROTECTION FRAMEWORK
# MedPact Platinum v2.0 - Foundational Code Protection
# Created: January 30, 2026
# Owner: Christopher Williams

## ⚠️ CRITICAL: READ BEFORE PROCEEDING

This document establishes the security framework to protect your foundational codebase
from unauthorized access, copying, or exposure to AI systems and end users.

---

## 🛡️ TIER 1: GITHUB REPOSITORY PROTECTION

### Step 1: Make Repository Private (CRITICAL)

**Do this IMMEDIATELY:**

1. Go to: https://github.com/ChrisWilliams2020/medpact_mvp_enterprise_pack-price-transparency-app-/settings

2. Scroll to "Danger Zone"

3. Click "Change repository visibility"

4. Select **"Make private"**

5. Confirm the change

**Result:** Only you and authorized collaborators can view the code.

---

### Step 2: Enable Branch Protection Rules

1. Go to: Repository Settings → Branches

2. Click "Add rule"

3. Branch name pattern: `main`

4. Enable these protections:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators
   - ✅ Restrict who can push to matching branches
   - ✅ Do not allow bypassing the above settings

5. Save changes

**Result:** Prevents accidental or unauthorized code changes.

---

### Step 3: Enable Repository Security Features

1. Go to: Settings → Security & analysis

2. Enable ALL of these:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Secret scanning
   - ✅ Push protection

**Result:** GitHub automatically detects exposed secrets and vulnerabilities.

---

## 🔐 TIER 2: VERCEL DEPLOYMENT PROTECTION

### Step 1: Environment Variable Protection

**In Vercel Dashboard:**

1. Go to: Project Settings → Environment Variables

2. For EACH environment variable:
   - Set visibility to: **"Encrypted"**
   - Enable: **"Only visible to authorized team members"**
   - Disable: **"Expose to client-side"** (unless specifically needed)

3. Critical variables to protect:
   ```
   DATABASE_URL (Server-only)
   NEXTAUTH_SECRET (Server-only)
   STRIPE_SECRET_KEY (Server-only)
   SUPABASE_SERVICE_ROLE_KEY (Server-only)
   OPENAI_API_KEY (Server-only)
   ANTHROPIC_API_KEY (Server-only)
   ```

---

### Step 2: Vercel Team & Access Control

1. Go to: Vercel Team Settings → Members

2. Set your role: **Owner**

3. For any team members:
   - Use **"Developer"** role (NOT Owner)
   - Enable **"Require 2FA"**
   - Limit to **specific projects only**

4. Enable: **Team-wide 2FA requirement**

---

### Step 3: Deployment Protection

1. Go to: Project Settings → Deployment Protection

2. Enable:
   - ✅ **Password Protection** (for previews)
   - ✅ **Vercel Authentication** (require login to view)
   - ✅ **Protection Bypass for Automation** (OFF)

3. For Production:
   - Enable: **Deployment approval required**
   - Add: Your email as sole approver

---

## 🚫 TIER 3: AI ISOLATION & USER PROTECTION

### Create API Route Protection Middleware

This prevents code exposure through your application:

**File: `middleware.ts` (Already exists - we'll enhance it)**

Add these security headers to prevent code inspection:

```typescript
// Prevent source code access
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Prevent source map access
  if (request.nextUrl.pathname.endsWith('.map')) {
    return new NextResponse(null, { status: 404 });
  }
  
  // Prevent .env file access
  if (request.nextUrl.pathname.includes('.env')) {
    return new NextResponse(null, { status: 404 });
  }
  
  // Prevent git file access
  if (request.nextUrl.pathname.includes('.git')) {
    return new NextResponse(null, { status: 404 });
  }
  
  return response;
}
```

---

### Disable Source Maps in Production

**File: `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // CRITICAL: Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Prevent webpack stats exposure
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.devtool = false;
    }
    return config;
  },
};

module.exports = nextConfig;
```

---

## 🔒 TIER 4: DATABASE & DATA PROTECTION

### Implement Row-Level Security (RLS)

**If using Supabase/PostgreSQL:**

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
-- ... for all tables

-- Create policies
CREATE POLICY "Users can only view their own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can only update their own data"
ON users FOR UPDATE
USING (auth.uid() = id);
```

---

### Separate Admin Database Access

Create a separate database user with limited permissions:

```sql
-- Create application user (limited permissions)
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM app_user;

-- Admin user (full access - only you)
-- Use different credentials for admin access
```

Use `app_user` credentials in your production `DATABASE_URL`.

---

## 🛡️ TIER 5: AI SYSTEM ISOLATION

### Prevent AI from Accessing Source Code

**Create: `lib/ai/security-guard.ts`**

```typescript
/**
 * AI Security Guard
 * Prevents AI systems from accessing or exposing source code
 */

export class AISecurityGuard {
  private static readonly BLOCKED_PATTERNS = [
    /\.env/i,
    /password/i,
    /secret/i,
    /api[_-]?key/i,
    /private[_-]?key/i,
    /config/i,
    /\.git/i,
  ];

  /**
   * Sanitize any output going to AI systems
   */
  static sanitizeForAI(input: string): string {
    let sanitized = input;
    
    // Remove environment variables
    sanitized = sanitized.replace(/process\.env\.[A-Z_]+/g, '[REDACTED]');
    
    // Remove API keys
    sanitized = sanitized.replace(/[a-zA-Z0-9]{32,}/g, '[KEY_REDACTED]');
    
    // Remove connection strings
    sanitized = sanitized.replace(/postgresql:\/\/[^\s]+/g, '[DB_REDACTED]');
    
    return sanitized;
  }

  /**
   * Check if content should be blocked from AI
   */
  static isBlockedFromAI(content: string): boolean {
    return this.BLOCKED_PATTERNS.some(pattern => pattern.test(content));
  }

  /**
   * Sanitize database queries before logging
   */
  static sanitizeQuery(query: string): string {
    return query
      .replace(/WHERE.*?(?=ORDER|LIMIT|$)/gi, 'WHERE [REDACTED]')
      .replace(/VALUES\s*\([^)]+\)/gi, 'VALUES ([REDACTED])');
  }
}
```

---

### Implement in AI Routes

**For any AI-facing endpoints:**

```typescript
import { AISecurityGuard } from '@/lib/ai/security-guard';

export async function POST(req: Request) {
  const { userQuery } = await req.json();
  
  // Block sensitive patterns
  if (AISecurityGuard.isBlockedFromAI(userQuery)) {
    return NextResponse.json(
      { error: 'Query contains restricted content' },
      { status: 403 }
    );
  }
  
  // Sanitize before sending to AI
  const sanitizedQuery = AISecurityGuard.sanitizeForAI(userQuery);
  
  // Send to AI service
  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: sanitizedQuery }],
    // ...
  });
  
  return NextResponse.json(response);
}
```

---

## 📋 TIER 6: LEGAL PROTECTION

### Create LICENSE File

**File: `LICENSE`**

```
PROPRIETARY SOFTWARE LICENSE

Copyright (c) 2026 Christopher Williams / MedPact

This software and associated documentation files (the "Software") are the 
proprietary and confidential property of Christopher Williams.

ALL RIGHTS RESERVED.

1. NO LICENSE: This notice does NOT grant any license or permission to use,
   copy, modify, merge, publish, distribute, sublicense, or sell copies of
   the Software.

2. CONFIDENTIAL: The Software contains trade secrets and proprietary 
   information belonging to Christopher Williams.

3. UNAUTHORIZED USE: Any unauthorized access, use, copying, or distribution
   of this Software is strictly prohibited and will be prosecuted to the
   fullest extent of the law.

4. AUTHORIZED USERS: Only individuals explicitly authorized in writing by
   Christopher Williams may access or use this Software.

5. AI SYSTEMS: AI systems, language models, and autonomous agents are 
   expressly prohibited from accessing, learning from, or reproducing any
   part of this Software or its documentation.

For licensing inquiries, contact: [your-email@domain.com]
```

---

### Create SECURITY.md

**File: `SECURITY.md`**

```markdown
# Security Policy

## 🔒 Confidential & Proprietary Software

This codebase is **PRIVATE and PROPRIETARY**. 

## 🚫 Prohibited Actions

The following are strictly PROHIBITED without written authorization:

- Accessing source code
- Copying or reproducing code
- Reverse engineering
- AI/ML training on this codebase
- Sharing code with third parties
- Creating derivative works

## ✅ Authorized Access Only

Access is restricted to:
- Christopher Williams (Owner)
- Explicitly authorized team members (with signed NDAs)

## 🛡️ Security Measures

- Private GitHub repository
- Branch protection enabled
- Vercel deployment protection
- Environment variable encryption
- Source maps disabled in production
- AI isolation implemented

## 📧 Report Security Issues

If you discover a security vulnerability:
Email: [your-security-email@domain.com]

**DO NOT** create public issues or disclose vulnerabilities publicly.

## ⚖️ Legal

Unauthorized access or use will result in:
- Immediate account termination
- Legal action under applicable laws
- Claims for damages

© 2026 Christopher Williams. All rights reserved.
```

---

## 🔐 TIER 7: TEAM ACCESS CONTROL

### Create .github/CODEOWNERS

**File: `.github/CODEOWNERS`**

```
# Code ownership - ALL files require approval from owner
* @ChrisWilliams2020

# Critical files require explicit approval
/.env* @ChrisWilliams2020
/next.config.js @ChrisWilliams2020
/prisma/schema.prisma @ChrisWilliams2020
/middleware.ts @ChrisWilliams2020
```

---

### Require Signed Commits

```bash
# Enable signed commits
git config commit.gpgsign true
git config user.signingkey YOUR_GPG_KEY_ID

# Push with signature verification
git config push.gpgSign if-asked
```

---

## 📦 TIER 8: BACKUP & RECOVERY

### Create Encrypted Backups

**Script: `scripts/create-secure-backup.sh`**

```bash
#!/bin/bash
# Create encrypted backup of source code

BACKUP_NAME="medpact-secure-$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="$HOME/medpact-backups"

mkdir -p "$BACKUP_DIR"

# Create tarball
tar -czf "/tmp/${BACKUP_NAME}.tar.gz" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  .

# Encrypt with password
openssl enc -aes-256-cbc -salt \
  -in "/tmp/${BACKUP_NAME}.tar.gz" \
  -out "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc" \
  -k "YOUR_SECURE_PASSWORD"

# Remove unencrypted version
rm "/tmp/${BACKUP_NAME}.tar.gz"

echo "Encrypted backup created: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc"
```

---

## ✅ SECURITY IMPLEMENTATION CHECKLIST

### Immediate Actions (Do Now):

- [ ] Make GitHub repository PRIVATE
- [ ] Enable branch protection on `main`
- [ ] Enable GitHub security features
- [ ] Add LICENSE file
- [ ] Add SECURITY.md file
- [ ] Disable production source maps in next.config.js
- [ ] Add security headers to middleware.ts
- [ ] Create encrypted backup
- [ ] Enable Vercel password protection
- [ ] Set up 2FA on GitHub account
- [ ] Set up 2FA on Vercel account

### Within 24 Hours:

- [ ] Implement AI Security Guard
- [ ] Create CODEOWNERS file
- [ ] Set up signed commits
- [ ] Review and encrypt all environment variables
- [ ] Set up database row-level security
- [ ] Create separate admin database credentials
- [ ] Document authorized team members
- [ ] Create NDA template for collaborators

### Ongoing:

- [ ] Weekly encrypted backups
- [ ] Monthly security audit
- [ ] Review access logs
- [ ] Update dependencies for security patches
- [ ] Monitor Dependabot alerts

---

## 🚨 EMERGENCY PROCEDURES

### If Code is Compromised:

1. **Immediately:**
   - Rotate ALL API keys and secrets
   - Change database passwords
   - Revoke OAuth tokens
   - Lock GitHub repository

2. **Within 1 Hour:**
   - Review access logs
   - Identify breach source
   - Document incident
   - Notify affected parties

3. **Recovery:**
   - Restore from encrypted backup
   - Implement additional security measures
   - Legal consultation if needed

---

## 📞 SUPPORT CONTACTS

**Security Issues:** [your-security-email]
**Legal Questions:** [your-legal-email]
**Technical Support:** [your-tech-email]

---

## 📚 ADDITIONAL RESOURCES

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Vercel Security](https://vercel.com/docs/security)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**REMEMBER: Security is not a one-time setup. It requires ongoing vigilance!**

© 2026 Christopher Williams - All Rights Reserved
