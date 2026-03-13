import os
from io import BytesIO
from typing import Optional

try:
    from minio import Minio
    from minio.error import S3Error
except Exception:
    Minio = None


def get_minio_client():
    endpoint = os.getenv('MINIO_ENDPOINT', 'localhost:9000')
    access_key = os.getenv('MINIO_ACCESS_KEY', 'minio')
    secret_key = os.getenv('MINIO_SECRET_KEY', 'minio123')
    secure = os.getenv('MINIO_SECURE', 'false').lower() in ('1', 'true', 'yes')
    if Minio is None:
        raise RuntimeError('minio package not available; please install minio in your environment')
    return Minio(endpoint, access_key=access_key, secret_key=secret_key, secure=secure)


def ensure_bucket(client: Minio, bucket: str):
    try:
        if not client.bucket_exists(bucket):
            client.make_bucket(bucket)
    except Exception:
        # best-effort: if cluster not ready, let caller handle errors
        pass


def upload_bytes(bucket: str, object_name: str, data: bytes):
    client = get_minio_client()
    ensure_bucket(client, bucket)
    bio = BytesIO(data)
    client.put_object(bucket, object_name, bio, length=len(data))


def download_to_path(bucket: str, object_name: str, dest_path: str):
    client = get_minio_client()
    ensure_bucket(client, bucket)
    try:
        client.fget_object(bucket, object_name, dest_path)
    except Exception as e:
        raise
