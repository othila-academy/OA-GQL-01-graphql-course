import graphene

from .event_type import Event
from .mutation import Mutation
from .query import Query
from .user_type import User

schema = graphene.Schema(query=Query, mutation=Mutation, types=[User, Event])
