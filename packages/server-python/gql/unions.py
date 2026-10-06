import graphene
from .user_type import User
from .event_type import Event


class SearchResult(graphene.Union):
    class Meta:
        types = (User, Event)
