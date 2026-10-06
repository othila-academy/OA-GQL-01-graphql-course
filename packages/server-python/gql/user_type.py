import graphene

from data import repositories as repo
from .enums import Role
from .interfaces import Node


def _event():
    # Import différé : User et Event se référencent mutuellement.
    from .event_type import Event

    return Event


class User(graphene.ObjectType):
    """Les résolveurs renvoient des UserModel : graphene lit `id` et `name` sur le modèle."""

    class Meta:
        interfaces = (Node,)

    name = graphene.String(required=True)
    email = graphene.String(required=True)
    role = graphene.Field(Role, required=True)
    organized_events = graphene.List(graphene.NonNull(lambda: _event()), required=True)
    participating_events = graphene.List(graphene.NonNull(lambda: _event()), required=True)

    def resolve_organized_events(root, info):
        return repo.get_events_organized_by_user(root.id)

    def resolve_participating_events(root, info):
        return repo.get_events_participated_by_user(root.id)
