from __future__ import absolute_import, unicode_literals
from celery import shared_task
from .models import User
import logging

logger = logging.getLogger(__name__)


@shared_task
def delete_user_if_not_in_group(user_id):
    logger.info("start task")
    print("start task")
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.info("Если пользователя не существует, просто вернемся")
        print("Если пользователя не существует, просто вернемся")
        return

    if not user.groups.filter(name='User').exists():
        logger.info("Если пользователь не в группе 'User', удалите его")
        print("Если пользователь не в группе 'User', удалите его")
        user.delete()
        logger.info("SUCCESS")
        print("SUCCESS")
    else:
        logger.info("что-то другое")
        print("что-то другое")
