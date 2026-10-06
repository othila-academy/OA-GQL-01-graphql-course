import graphene

from .user_type import User


class AuthPayload(graphene.ObjectType):
    token = graphene.String(required=True)
    user = graphene.Field(User, required=True)
