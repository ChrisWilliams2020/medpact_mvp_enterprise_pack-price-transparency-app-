"""Initial schema - create all base tables

Revision ID: 0000_initial_schema
Revises: 
Create Date: 2026-03-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0000_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create import_jobs table
    op.create_table(
        'import_jobs',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('job_id', sa.String(length=64), nullable=False, unique=True),
        sa.Column('filename', sa.String(length=512), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=True),
        sa.Column('progress', sa.Integer, nullable=True),
        sa.Column('processed_rows', sa.Integer, nullable=True),
        sa.Column('error', sa.Text, nullable=True),
        sa.Column('checksum', sa.String(length=128), nullable=True),
        sa.Column('practice_id', sa.String(length=128), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('now()'), onupdate=sa.text('now()')),
    )
    op.create_index('ix_import_jobs_checksum', 'import_jobs', ['checksum'])
    op.create_index('ix_import_jobs_practice_id', 'import_jobs', ['practice_id'])

    # Create claim_lines table
    op.create_table(
        'claim_lines',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('claim_id', sa.String(length=64), nullable=True),
        sa.Column('practice_id', sa.String(length=128), nullable=True),
        sa.Column('date_of_service', sa.Date, nullable=True),
        sa.Column('cpt_code', sa.String(length=16), nullable=True),
        sa.Column('payer_name', sa.String(length=256), nullable=True),
        sa.Column('allowed_amount', sa.Numeric(12, 2), nullable=True),
        sa.Column('paid_amount', sa.Numeric(12, 2), nullable=True),
        sa.Column('patient_id', sa.String(length=64), nullable=True),
        sa.Column('payment_date', sa.Date, nullable=True),
        sa.Column('status', sa.String(length=32), nullable=True),
        sa.Column('raw_payload', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
    )
    op.create_index('ix_claim_lines_practice_id', 'claim_lines', ['practice_id'])
    op.create_index('ix_claim_lines_date_of_service', 'claim_lines', ['date_of_service'])

    # Create todos table
    op.create_table(
        'todos',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('practice_id', sa.String(length=128), nullable=True),
        sa.Column('title', sa.String(length=512), nullable=False),
        sa.Column('completed', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
    )
    op.create_index('ix_todos_practice_id', 'todos', ['practice_id'])

    # Create practice_metric_entries table
    op.create_table(
        'practice_metric_entries',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('practice_id', sa.String(length=128), nullable=True),
        sa.Column('profile', sa.String(length=64), nullable=False),
        sa.Column('metric_key', sa.String(length=128), nullable=False),
        sa.Column('payload', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
    )
    op.create_index('ix_practice_metric_entries_practice_id', 'practice_metric_entries', ['practice_id'])
    op.create_index('ix_practice_metric_entries_metric_key', 'practice_metric_entries', ['metric_key'])


def downgrade():
    op.drop_table('practice_metric_entries')
    op.drop_table('todos')
    op.drop_table('claim_lines')
    op.drop_table('import_jobs')
