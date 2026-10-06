import graphene

from .event_type import Event
from .user_type import User


class SearchResult(graphene.Union):
    class Meta:
        types = (User, Event)

    @classmethod
    def resolve_type(cls, instance, info):
        return Event if hasattr(instance, "title") else User
