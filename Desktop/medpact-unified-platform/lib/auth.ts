// Authentication utilities for Market Intelligence
// Simple auth helper for development - replace with proper auth implementation

export async function requireOrgId(): Promise<string> {
  // For development/demo purposes, return a default org ID
  // In production, this would extract org ID from JWT token or session
  return 'org_medpact_default';
}

export async function getCurrentUser() {
  // Mock user for development
  return {
    id: 'user_demo',
    orgId: 'org_medpact_default',
    email: 'demo@medpact.com',
    role: 'admin'
  };
}

export async function hasPermission(permission: string): Promise<boolean> {
  // Mock permission check - return true for development
  return true;
}
