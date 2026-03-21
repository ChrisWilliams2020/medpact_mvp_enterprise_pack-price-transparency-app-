// Your exact specification:
import { buildNegotiationPlaybook } from '@/lib/market-intel/negotiation';
import { requireOrgId } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Implements your exact logic:
- Gets orgId for authentication
- Falls back to first practice if practiceId not provided
- Uses your buildNegotiationPlaybook function
- Returns proper error handling and JSON responses