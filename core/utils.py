import os
import uuid
from django.core.exceptions import ValidationError
from django.utils.text import slugify

def validate_file_size(value):
    filesize = value.size
    if filesize > 5 * 1024 * 1024:
        raise ValidationError("The maximum file size that can be uploaded is 5MB")
    return value

def validate_image_or_pdf(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension. Only PDF, JPG, PNG are allowed.')

def get_unique_filename(filename):
    ext = filename.split('.')[-1]
    name = ".".join(filename.split('.')[:-1])
    unique_id = uuid.uuid4().hex[:8]
    return f"{slugify(name)}_{unique_id}.{ext}"
