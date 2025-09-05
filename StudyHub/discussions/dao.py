from django.db.models import Sum
from . import models

def update_score(vote):
    obj = vote.content_object
    obj.score = models.Vote.objects.filter(
        content_type=vote.content_type,
        object_id=vote.object_id
    ).aggregate(total=Sum('value'))['total'] or 0
    obj.save(update_fields=['score'])
    return obj.score
