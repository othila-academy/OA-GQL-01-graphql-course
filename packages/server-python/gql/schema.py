import graphene
from .query import Query
from .user_type import User
from .event_type import Event

schema = graphene.Schema(query=Query, types=[User, Event])
