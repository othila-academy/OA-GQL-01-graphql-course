import graphene


class Node(graphene.Interface):
    """Interface commune avec un identifiant global."""

    id = graphene.ID(required=True)

    @classmethod
    def resolve_type(cls, instance, info):
        # Les résolveurs renvoient les modèles du dépôt : un événement a un titre.
        from .event_type import Event
        from .user_type import User

        return Event if hasattr(instance, "title") else User
