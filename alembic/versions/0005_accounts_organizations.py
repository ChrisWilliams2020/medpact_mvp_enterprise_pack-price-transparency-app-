"""Add accounts, organizations, and practice hierarchy for multi-tenant management

Revision ID: 0005
Revises: 0004
Create Date: 2026-03-15

This migration creates the account management structure:
- accounts: MedPact team members who can manage practices
- organizations: Groups that own multiple practices (PE firms, large clinic networks)
- practices: Updated to link to organizations
- account_practice_access: Role-based access control
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime

# revision identifiers
revision = '0005'
down_revision = '0004'
branch_labels = None
depends_on = None


def upgrade():
    # =========================================================================
    # ACCOUNTS TABLE - MedPact team members and practice administrators
    # =========================================================================
    op.create_table(
        'accounts',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('first_name', sa.String(100), nullable=False),
        sa.Column('last_name', sa.String(100), nullable=False),
        sa.Column('phone', sa.String(20), nullable=True),
        
        # Account type determines system-wide permissions
        sa.Column('account_type', sa.String(50), nullable=False, server_default='practice_user'),
        # Types: 'medpact_admin', 'medpact_support', 'organization_admin', 'practice_admin', 'practice_user'
        
        sa.Column('is_active', sa.Boolean, nullable=False, server_default='true'),
        sa.Column('email_verified', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('email_verified_at', sa.DateTime, nullable=True),
        
        # MFA settings
        sa.Column('mfa_enabled', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('mfa_secret', sa.String(255), nullable=True),
        
        # Profile and preferences
        sa.Column('profile_image_url', sa.String(500), nullable=True),
        sa.Column('preferences', JSONB, nullable=True),
        
        # Audit fields
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.text('NOW()')),
        sa.Column('last_login_at', sa.DateTime, nullable=True),
        sa.Column('created_by', UUID(as_uuid=True), nullable=True),
    )
    
    op.create_index('ix_accounts_email', 'accounts', ['email'])
    op.create_index('ix_accounts_account_type', 'accounts', ['account_type'])
    
    # =========================================================================
    # ORGANIZATIONS TABLE - PE firms, large clinic networks, health systems
    # =========================================================================
    op.create_table(
        'organizations',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('legal_name', sa.String(255), nullable=True),
        sa.Column('tax_id', sa.String(20), nullable=True),  # EIN for US entities
        
        # Organization type
        sa.Column('org_type', sa.String(50), nullable=False, server_default='single_practice'),
        # Types: 'single_practice', 'multi_location', 'pe_portfolio', 'health_system', 'mso'
        
        # Contact information
        sa.Column('primary_contact_name', sa.String(200), nullable=True),
        sa.Column('primary_contact_email', sa.String(255), nullable=True),
        sa.Column('primary_contact_phone', sa.String(20), nullable=True),
        sa.Column('billing_email', sa.String(255), nullable=True),
        
        # Address
        sa.Column('address_line1', sa.String(255), nullable=True),
        sa.Column('address_line2', sa.String(255), nullable=True),
        sa.Column('city', sa.String(100), nullable=True),
        sa.Column('state', sa.String(2), nullable=True),
        sa.Column('zip_code', sa.String(10), nullable=True),
        
        # Subscription and billing
        sa.Column('subscription_tier', sa.String(50), nullable=False, server_default='standard'),
        # Tiers: 'trial', 'standard', 'professional', 'enterprise'
        sa.Column('subscription_status', sa.String(50), nullable=False, server_default='active'),
        sa.Column('subscription_start_date', sa.Date, nullable=True),
        sa.Column('subscription_end_date', sa.Date, nullable=True),
        sa.Column('max_practices', sa.Integer, nullable=False, server_default='1'),
        sa.Column('max_users', sa.Integer, nullable=False, server_default='5'),
        
        # Settings
        sa.Column('settings', JSONB, nullable=True),
        sa.Column('branding', JSONB, nullable=True),  # Custom logo, colors for white-label
        
        # Status
        sa.Column('is_active', sa.Boolean, nullable=False, server_default='true'),
        
        # Audit fields
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.text('NOW()')),
        sa.Column('created_by', UUID(as_uuid=True), sa.ForeignKey('accounts.id'), nullable=True),
    )
    
    op.create_index('ix_organizations_name', 'organizations', ['name'])
    op.create_index('ix_organizations_org_type', 'organizations', ['org_type'])
    
    # =========================================================================
    # UPDATE PRACTICES TABLE - Add organization link
    # =========================================================================
    # Add organization_id to practices table
    op.add_column('practices', 
        sa.Column('organization_id', UUID(as_uuid=True), sa.ForeignKey('organizations.id'), nullable=True)
    )
    
    # Add additional practice fields
    op.add_column('practices',
        sa.Column('practice_type', sa.String(50), nullable=True)
    )
    # Types: 'solo', 'group', 'hospital_based', 'asc', 'retail'
    
    op.add_column('practices',
        sa.Column('provider_count', sa.Integer, nullable=True)
    )
    
    op.add_column('practices',
        sa.Column('annual_patient_volume', sa.Integer, nullable=True)
    )
    
    op.add_column('practices',
        sa.Column('ehr_system', sa.String(100), nullable=True)
    )
    
    op.add_column('practices',
        sa.Column('pm_system', sa.String(100), nullable=True)
    )
    
    op.add_column('practices',
        sa.Column('is_active', sa.Boolean, nullable=False, server_default='true')
    )
    
    op.create_index('ix_practices_organization_id', 'practices', ['organization_id'])
    
    # =========================================================================
    # ACCOUNT_ORGANIZATION_ACCESS - Organization-level roles
    # =========================================================================
    op.create_table(
        'account_organization_access',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('account_id', UUID(as_uuid=True), sa.ForeignKey('accounts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('organization_id', UUID(as_uuid=True), sa.ForeignKey('organizations.id', ondelete='CASCADE'), nullable=False),
        
        # Role at organization level
        sa.Column('role', sa.String(50), nullable=False, server_default='viewer'),
        # Roles: 'owner', 'admin', 'manager', 'analyst', 'viewer'
        
        sa.Column('is_primary', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('granted_at', sa.DateTime, nullable=False, server_default=sa.text('NOW()')),
        sa.Column('granted_by', UUID(as_uuid=True), sa.ForeignKey('accounts.id'), nullable=True),
        sa.Column('expires_at', sa.DateTime, nullable=True),
        
        sa.UniqueConstraint('account_id', 'organization_id', name='uq_account_organization'),
    )
    
    op.create_index('ix_account_org_access_account', 'account_organization_access', ['account_id'])
    op.create_index('ix_account_org_access_org', 'account_organization_access', ['organization_id'])
    
    # =========================================================================
    # ACCOUNT_PRACTICE_ACCESS - Practice-level roles (granular permissions)
    # =========================================================================
    op.create_table(
        'account_practice_access',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('account_id', UUID(as_uuid=True), sa.ForeignKey('accounts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('practice_id', UUID(as_uuid=True), sa.ForeignKey('practices.id', ondelete='CASCADE'), nullable=False),
        
        # Role at practice level
        sa.Column('role', sa.String(50), nullable=False, server_default='viewer'),
        # Roles: 'admin', 'manager', 'analyst', 'biller', 'viewer'
        
        # Granular permissions (JSON array of permission strings)
        sa.Column('permissions', JSONB, nullable=True),
        # Permissions: 'upload_data', 'view_phi', 'export_data', 'manage_users', 'view_benchmarks', 'edit_settings'
        
        sa.Column('granted_at', sa.DateTime, nullable=False, server_default=sa.text('NOW()')),
        sa.Column('granted_by', UUID(as_uuid=True), sa.ForeignKey('accounts.id'), nullable=True),
        sa.Column('expires_at', sa.DateTime, nullable=True),
        
        sa.UniqueConstraint('account_id', 'practice_id', name='uq_account_practice'),
    )
    
    op.create_index('ix_account_practice_access_account', 'account_practice_access', ['account_id'])
    op.create_index('ix_account_practice_access_practice', 'account_practice_access', ['practice_id'])
    
    # =========================================================================
    # INVITATIONS TABLE - For inviting users to organizations/practices
    # =========================================================================
    op.create_table(
        'invitations',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('token', sa.String(255), nullable=False, unique=True),
        
        # What are they being invited to?
        sa.Column('organization_id', UUID(as_uuid=True), sa.ForeignKey('organizations.id', ondelete='CASCADE'), nullable=True),
        sa.Column('practice_id', UUID(as_uuid=True), sa.ForeignKey('practices.id', ondelete='CASCADE'), nullable=True),
        
        # Role they'll receive upon acceptance
        sa.Column('role', sa.String(50), nullable=False, server_default='viewer'),
        
        # Status tracking
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        # Status: 'pending', 'accepted', 'expired', 'revoked'
        
        sa.Column('invited_by', UUID(as_uuid=True), sa.ForeignKey('accounts.id'), nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.text('NOW()')),
        sa.Column('expires_at', sa.DateTime, nullable=False),
        sa.Column('accepted_at', sa.DateTime, nullable=True),
        sa.Column('accepted_by', UUID(as_uuid=True), sa.ForeignKey('accounts.id'), nullable=True),
    )
    
    op.create_index('ix_invitations_email', 'invitations', ['email'])
    op.create_index('ix_invitations_token', 'invitations', ['token'])
    op.create_index('ix_invitations_status', 'invitations', ['status'])
    
    # =========================================================================
    # PRACTICE_REGISTRATION_REQUESTS - For practices requesting to join MedPact
    # =========================================================================
    op.create_table(
        'practice_registration_requests',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        
        # Requestor information
        sa.Column('requestor_name', sa.String(200), nullable=False),
        sa.Column('requestor_email', sa.String(255), nullable=False),
        sa.Column('requestor_phone', sa.String(20), nullable=True),
        sa.Column('requestor_title', sa.String(100), nullable=True),
        
        # Practice information
        sa.Column('practice_name', sa.String(255), nullable=False),
        sa.Column('practice_npi', sa.String(10), nullable=True),
        sa.Column('practice_tax_id', sa.String(20), nullable=True),
        sa.Column('specialty', sa.String(100), nullable=True),
        sa.Column('provider_count', sa.Integer, nullable=True),
        sa.Column('location_count', sa.Integer, nullable=True, server_default='1'),
        
        # Address
        sa.Column('address_line1', sa.String(255), nullable=True),
        sa.Column('city', sa.String(100), nullable=True),
        sa.Column('state', sa.String(2), nullable=True),
        sa.Column('zip_code', sa.String(10), nullable=True),
        
        # Organization context (if part of larger group)
        sa.Column('is_part_of_organization', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('organization_name', sa.String(255), nullable=True),
        sa.Column('organization_type', sa.String(50), nullable=True),
        
        # Systems information
        sa.Column('ehr_system', sa.String(100), nullable=True),
        sa.Column('pm_system', sa.String(100), nullable=True),
        
        # Additional notes
        sa.Column('notes', sa.Text, nullable=True),
        sa.Column('referral_source', sa.String(100), nullable=True),
        
        # Status
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        # Status: 'pending', 'under_review', 'approved', 'rejected', 'onboarding', 'completed'
        
        sa.Column('reviewed_by', UUID(as_uuid=True), sa.ForeignKey('accounts.id'), nullable=True),
        sa.Column('reviewed_at', sa.DateTime, nullable=True),
        sa.Column('review_notes', sa.Text, nullable=True),
        
        # Created entities (after approval)
        sa.Column('created_organization_id', UUID(as_uuid=True), sa.ForeignKey('organizations.id'), nullable=True),
        sa.Column('created_practice_id', UUID(as_uuid=True), sa.ForeignKey('practices.id'), nullable=True),
        sa.Column('created_account_id', UUID(as_uuid=True), sa.ForeignKey('accounts.id'), nullable=True),
        
        # Audit
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.text('NOW()')),
    )
    
    op.create_index('ix_practice_reg_requests_status', 'practice_registration_requests', ['status'])
    op.create_index('ix_practice_reg_requests_email', 'practice_registration_requests', ['requestor_email'])


def downgrade():
    op.drop_table('practice_registration_requests')
    op.drop_table('invitations')
    op.drop_table('account_practice_access')
    op.drop_table('account_organization_access')
    
    op.drop_index('ix_practices_organization_id', 'practices')
    op.drop_column('practices', 'is_active')
    op.drop_column('practices', 'pm_system')
    op.drop_column('practices', 'ehr_system')
    op.drop_column('practices', 'annual_patient_volume')
    op.drop_column('practices', 'provider_count')
    op.drop_column('practices', 'practice_type')
    op.drop_column('practices', 'organization_id')
    
    op.drop_table('organizations')
    op.drop_table('accounts')
