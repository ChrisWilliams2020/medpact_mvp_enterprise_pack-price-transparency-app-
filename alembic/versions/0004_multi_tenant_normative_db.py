"""Multi-tenant data isolation with normative database

Revision ID: 0004_multi_tenant_normative_db
Revises: 0003_add_practice_metric_entries
Create Date: 2026-03-15 00:00:00.000000

This migration establishes the data architecture for:
1. Practice-specific IDENTIFIED data (confidential, per-practice)
2. MedPact NORMATIVE database (de-identified, aggregated across all practices)

Key Principles:
- All identified data (patient names, claim IDs, etc.) stays within practice boundaries
- Only de-identified, aggregated metrics flow to the normative database
- Practices can benchmark against normative data without exposing their raw data
- Historical uploads are preserved for longitudinal analysis
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID

# revision identifiers, used by Alembic.
revision = '0004_multi_tenant_normative_db'
down_revision = '0000_initial_schema'
branch_labels = None
depends_on = None


def upgrade():
    # =========================================================================
    # PRACTICE REGISTRY - Master list of all practices
    # =========================================================================
    op.create_table(
        'practices',
        sa.Column('id', sa.String(length=128), primary_key=True),
        sa.Column('name', sa.String(length=256), nullable=False),
        sa.Column('specialty', sa.String(length=128), nullable=True),
        sa.Column('size_category', sa.String(length=32), nullable=True),  # small, medium, large
        sa.Column('region', sa.String(length=64), nullable=True),
        sa.Column('state', sa.String(length=2), nullable=True),
        sa.Column('zip_prefix', sa.String(length=3), nullable=True),  # First 3 digits only for privacy
        sa.Column('npi', sa.String(length=10), nullable=True),  # Practice NPI
        sa.Column('tax_id_hash', sa.String(length=64), nullable=True),  # Hashed for verification only
        sa.Column('subscription_tier', sa.String(length=32), default='basic'),
        sa.Column('data_sharing_consent', sa.Boolean, default=True),  # Consent to contribute to normative DB
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('now()'), onupdate=sa.text('now()')),
    )
    
    # =========================================================================
    # PRACTICE DATA UPLOADS - Track all historical uploads per practice
    # =========================================================================
    op.create_table(
        'practice_data_uploads',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('upload_id', sa.String(length=64), nullable=False, unique=True),
        sa.Column('practice_id', sa.String(length=128), sa.ForeignKey('practices.id'), nullable=False),
        sa.Column('filename', sa.String(length=512), nullable=True),
        sa.Column('file_type', sa.String(length=32), nullable=True),  # claims, charges, payments, etc.
        sa.Column('period_start', sa.Date, nullable=True),
        sa.Column('period_end', sa.Date, nullable=True),
        sa.Column('row_count', sa.Integer, nullable=True),
        sa.Column('checksum', sa.String(length=128), nullable=True),
        sa.Column('status', sa.String(length=32), default='pending'),
        sa.Column('error_message', sa.Text, nullable=True),
        sa.Column('processing_started_at', sa.DateTime, nullable=True),
        sa.Column('processing_completed_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
    )
    op.create_index('ix_practice_data_uploads_practice_id', 'practice_data_uploads', ['practice_id'])
    op.create_index('ix_practice_data_uploads_period', 'practice_data_uploads', ['period_start', 'period_end'])
    
    # =========================================================================
    # PRACTICE IDENTIFIED DATA - Confidential data per practice
    # This data NEVER leaves the practice's data boundary
    # =========================================================================
    
    # Patient registry (identified - practice specific)
    op.create_table(
        'practice_patients',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('practice_id', sa.String(length=128), sa.ForeignKey('practices.id'), nullable=False),
        sa.Column('patient_id', sa.String(length=64), nullable=False),  # Practice's internal patient ID
        sa.Column('mrn', sa.String(length=64), nullable=True),  # Medical Record Number
        sa.Column('first_name_encrypted', sa.Text, nullable=True),  # Encrypted PII
        sa.Column('last_name_encrypted', sa.Text, nullable=True),  # Encrypted PII
        sa.Column('dob_encrypted', sa.Text, nullable=True),  # Encrypted PII
        sa.Column('gender', sa.String(length=16), nullable=True),  # De-identified demographic
        sa.Column('age_bucket', sa.String(length=16), nullable=True),  # 0-17, 18-34, 35-49, 50-64, 65+
        sa.Column('zip_prefix', sa.String(length=3), nullable=True),  # First 3 digits only
        sa.Column('payer_type', sa.String(length=32), nullable=True),  # Medicare, Medicaid, Commercial, Self-Pay
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('now()')),
        sa.UniqueConstraint('practice_id', 'patient_id', name='uq_practice_patient'),
    )
    op.create_index('ix_practice_patients_practice_id', 'practice_patients', ['practice_id'])
    
    # Claims detail (identified - practice specific)
    op.create_table(
        'practice_claims',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('practice_id', sa.String(length=128), sa.ForeignKey('practices.id'), nullable=False),
        sa.Column('upload_id', sa.String(length=64), sa.ForeignKey('practice_data_uploads.upload_id'), nullable=True),
        sa.Column('claim_id', sa.String(length=64), nullable=False),
        sa.Column('patient_id', sa.String(length=64), nullable=True),
        sa.Column('date_of_service', sa.Date, nullable=True),
        sa.Column('date_submitted', sa.Date, nullable=True),
        sa.Column('date_paid', sa.Date, nullable=True),
        sa.Column('cpt_code', sa.String(length=16), nullable=True),
        sa.Column('icd10_codes', sa.ARRAY(sa.String(16)), nullable=True),
        sa.Column('modifier', sa.String(length=8), nullable=True),
        sa.Column('units', sa.Integer, nullable=True),
        sa.Column('payer_id', sa.String(length=64), nullable=True),
        sa.Column('payer_name', sa.String(length=256), nullable=True),
        sa.Column('payer_type', sa.String(length=32), nullable=True),
        sa.Column('charged_amount', sa.Numeric(12, 2), nullable=True),
        sa.Column('allowed_amount', sa.Numeric(12, 2), nullable=True),
        sa.Column('paid_amount', sa.Numeric(12, 2), nullable=True),
        sa.Column('adjustment_amount', sa.Numeric(12, 2), nullable=True),
        sa.Column('patient_responsibility', sa.Numeric(12, 2), nullable=True),
        sa.Column('claim_status', sa.String(length=32), nullable=True),
        sa.Column('denial_code', sa.String(length=16), nullable=True),
        sa.Column('denial_reason', sa.String(length=256), nullable=True),
        sa.Column('rendering_provider_npi', sa.String(length=10), nullable=True),
        sa.Column('place_of_service', sa.String(length=8), nullable=True),
        sa.Column('raw_data', JSONB, nullable=True),  # Original row for audit
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
    )
    op.create_index('ix_practice_claims_practice_id', 'practice_claims', ['practice_id'])
    op.create_index('ix_practice_claims_date_of_service', 'practice_claims', ['date_of_service'])
    op.create_index('ix_practice_claims_cpt_code', 'practice_claims', ['cpt_code'])
    op.create_index('ix_practice_claims_payer_type', 'practice_claims', ['payer_type'])
    op.create_index('ix_practice_claims_claim_status', 'practice_claims', ['claim_status'])
    
    # =========================================================================
    # PRACTICE METRICS SNAPSHOTS - Time-series metrics for each practice
    # Calculated from identified data, stored for historical trending
    # =========================================================================
    op.create_table(
        'practice_metrics_snapshots',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('practice_id', sa.String(length=128), sa.ForeignKey('practices.id'), nullable=False),
        sa.Column('snapshot_date', sa.Date, nullable=False),
        sa.Column('period_type', sa.String(length=16), nullable=False),  # daily, weekly, monthly
        sa.Column('period_start', sa.Date, nullable=False),
        sa.Column('period_end', sa.Date, nullable=False),
        
        # Financial Metrics
        sa.Column('gross_charges', sa.Numeric(14, 2), nullable=True),
        sa.Column('net_collections', sa.Numeric(14, 2), nullable=True),
        sa.Column('adjustments', sa.Numeric(14, 2), nullable=True),
        sa.Column('net_collection_rate', sa.Numeric(6, 4), nullable=True),  # As decimal (0.9234)
        sa.Column('days_in_ar', sa.Numeric(6, 2), nullable=True),
        sa.Column('ar_over_90_days', sa.Numeric(14, 2), nullable=True),
        sa.Column('ar_over_120_days', sa.Numeric(14, 2), nullable=True),
        
        # Volume Metrics
        sa.Column('total_claims', sa.Integer, nullable=True),
        sa.Column('total_patients', sa.Integer, nullable=True),
        sa.Column('total_encounters', sa.Integer, nullable=True),
        sa.Column('total_rvus', sa.Numeric(10, 2), nullable=True),
        
        # Denial Metrics
        sa.Column('denial_count', sa.Integer, nullable=True),
        sa.Column('denial_rate', sa.Numeric(6, 4), nullable=True),
        sa.Column('denial_amount', sa.Numeric(14, 2), nullable=True),
        
        # Payer Mix (as JSON for flexibility)
        sa.Column('payer_mix', JSONB, nullable=True),
        
        # Top CPT codes (as JSON)
        sa.Column('top_cpt_codes', JSONB, nullable=True),
        
        # Denial reasons breakdown (as JSON)
        sa.Column('denial_breakdown', JSONB, nullable=True),
        
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
        sa.UniqueConstraint('practice_id', 'snapshot_date', 'period_type', name='uq_practice_snapshot'),
    )
    op.create_index('ix_practice_metrics_snapshots_practice_id', 'practice_metrics_snapshots', ['practice_id'])
    op.create_index('ix_practice_metrics_snapshots_date', 'practice_metrics_snapshots', ['snapshot_date'])
    
    # =========================================================================
    # NORMATIVE DATABASE - De-identified, aggregated data across all practices
    # NO identified data - only statistical aggregates
    # =========================================================================
    
    # Normative benchmarks by specialty/region/size
    op.create_table(
        'normative_benchmarks',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('benchmark_date', sa.Date, nullable=False),
        sa.Column('period_type', sa.String(length=16), nullable=False),  # monthly, quarterly, annual
        sa.Column('specialty', sa.String(length=128), nullable=True),  # NULL = all specialties
        sa.Column('region', sa.String(length=64), nullable=True),  # NULL = national
        sa.Column('size_category', sa.String(length=32), nullable=True),  # NULL = all sizes
        
        # Number of practices in this cohort (for statistical validity)
        sa.Column('practice_count', sa.Integer, nullable=False),
        sa.Column('min_practices_threshold', sa.Integer, default=5),  # Must have 5+ practices
        
        # Financial Benchmark Statistics
        sa.Column('ncr_mean', sa.Numeric(6, 4), nullable=True),
        sa.Column('ncr_median', sa.Numeric(6, 4), nullable=True),
        sa.Column('ncr_p25', sa.Numeric(6, 4), nullable=True),  # 25th percentile
        sa.Column('ncr_p75', sa.Numeric(6, 4), nullable=True),  # 75th percentile
        sa.Column('ncr_p90', sa.Numeric(6, 4), nullable=True),  # 90th percentile
        
        sa.Column('dar_mean', sa.Numeric(6, 2), nullable=True),  # Days in A/R
        sa.Column('dar_median', sa.Numeric(6, 2), nullable=True),
        sa.Column('dar_p25', sa.Numeric(6, 2), nullable=True),
        sa.Column('dar_p75', sa.Numeric(6, 2), nullable=True),
        
        sa.Column('denial_rate_mean', sa.Numeric(6, 4), nullable=True),
        sa.Column('denial_rate_median', sa.Numeric(6, 4), nullable=True),
        sa.Column('denial_rate_p25', sa.Numeric(6, 4), nullable=True),
        sa.Column('denial_rate_p75', sa.Numeric(6, 4), nullable=True),
        
        # Volume benchmarks (per provider FTE)
        sa.Column('encounters_per_fte_mean', sa.Numeric(8, 2), nullable=True),
        sa.Column('encounters_per_fte_median', sa.Numeric(8, 2), nullable=True),
        sa.Column('rvus_per_fte_mean', sa.Numeric(10, 2), nullable=True),
        sa.Column('rvus_per_fte_median', sa.Numeric(10, 2), nullable=True),
        
        # Typical payer mix distribution
        sa.Column('payer_mix_benchmark', JSONB, nullable=True),
        
        # Top denial reasons across cohort
        sa.Column('top_denial_reasons', JSONB, nullable=True),
        
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
        sa.UniqueConstraint('benchmark_date', 'period_type', 'specialty', 'region', 'size_category', 
                          name='uq_normative_benchmark'),
    )
    op.create_index('ix_normative_benchmarks_date', 'normative_benchmarks', ['benchmark_date'])
    op.create_index('ix_normative_benchmarks_specialty', 'normative_benchmarks', ['specialty'])
    
    # Normative CPT code benchmarks (de-identified reimbursement rates)
    op.create_table(
        'normative_cpt_benchmarks',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('benchmark_date', sa.Date, nullable=False),
        sa.Column('cpt_code', sa.String(length=16), nullable=False),
        sa.Column('payer_type', sa.String(length=32), nullable=True),  # Medicare, Medicaid, Commercial
        sa.Column('region', sa.String(length=64), nullable=True),
        
        # Number of claims in this benchmark (for validity)
        sa.Column('claim_count', sa.Integer, nullable=False),
        sa.Column('practice_count', sa.Integer, nullable=False),
        
        # Reimbursement statistics
        sa.Column('allowed_mean', sa.Numeric(10, 2), nullable=True),
        sa.Column('allowed_median', sa.Numeric(10, 2), nullable=True),
        sa.Column('allowed_p25', sa.Numeric(10, 2), nullable=True),
        sa.Column('allowed_p75', sa.Numeric(10, 2), nullable=True),
        
        sa.Column('paid_mean', sa.Numeric(10, 2), nullable=True),
        sa.Column('paid_median', sa.Numeric(10, 2), nullable=True),
        
        # Denial rate for this CPT
        sa.Column('denial_rate', sa.Numeric(6, 4), nullable=True),
        
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
        sa.UniqueConstraint('benchmark_date', 'cpt_code', 'payer_type', 'region', name='uq_cpt_benchmark'),
    )
    op.create_index('ix_normative_cpt_benchmarks_cpt', 'normative_cpt_benchmarks', ['cpt_code'])
    op.create_index('ix_normative_cpt_benchmarks_payer', 'normative_cpt_benchmarks', ['payer_type'])
    
    # =========================================================================
    # AUDIT LOG - Track all data access for compliance
    # =========================================================================
    op.create_table(
        'data_access_audit_log',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('practice_id', sa.String(length=128), nullable=True),
        sa.Column('user_id', sa.String(length=128), nullable=True),
        sa.Column('action', sa.String(length=64), nullable=False),  # view, export, upload, delete
        sa.Column('resource_type', sa.String(length=64), nullable=False),  # claims, patients, metrics
        sa.Column('resource_id', sa.String(length=128), nullable=True),
        sa.Column('ip_address', sa.String(length=64), nullable=True),
        sa.Column('user_agent', sa.String(length=512), nullable=True),
        sa.Column('details', JSONB, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
    )
    op.create_index('ix_data_access_audit_practice', 'data_access_audit_log', ['practice_id'])
    op.create_index('ix_data_access_audit_user', 'data_access_audit_log', ['user_id'])
    op.create_index('ix_data_access_audit_action', 'data_access_audit_log', ['action'])
    op.create_index('ix_data_access_audit_created', 'data_access_audit_log', ['created_at'])


def downgrade():
    op.drop_table('data_access_audit_log')
    op.drop_table('normative_cpt_benchmarks')
    op.drop_table('normative_benchmarks')
    op.drop_table('practice_metrics_snapshots')
    op.drop_table('practice_claims')
    op.drop_table('practice_patients')
    op.drop_table('practice_data_uploads')
    op.drop_table('practices')
