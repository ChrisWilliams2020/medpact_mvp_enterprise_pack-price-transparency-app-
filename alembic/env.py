import os
import logging
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Try to configure logging from the ini file; fall back to basic logging
try:
    if config.config_file_name:
        fileConfig(config.config_file_name)
except Exception:
    logging.basicConfig(level=logging.INFO)

# Prefer DATABASE_URL from the environment; set it into config so engine_from_config works
db_url = os.getenv('DATABASE_URL')
if db_url:
    try:
        config.set_main_option('sqlalchemy.url', db_url)
    except Exception:
        # harmless if config doesn't support set_main_option
        pass

# add your model's MetaData object here for 'autogenerate' support
import apps.api.app.db as app_db
# Ensure the db metadata is ready
try:
    app_db._ensure_db()
except Exception:
    pass

target_metadata = getattr(app_db, 'metadata', None)


def run_migrations_offline():
    url = db_url or config.get_main_option('sqlalchemy.url')
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    # Build a minimal configuration dict to avoid parsing/interpolation issues
    configuration = {}
    # sqlalchemy.url should come from env or main option; avoid config.get_section which can interpolate
    sqlalchemy_url = db_url or config.get_main_option('sqlalchemy.url', None)
    if sqlalchemy_url:
        configuration['sqlalchemy.url'] = sqlalchemy_url

    connectable = engine_from_config(configuration, prefix='sqlalchemy.', poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
        try:
            with context.begin_transaction():
                context.run_migrations()
        except Exception:
            logging.exception('Error while running migrations')
            raise


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
