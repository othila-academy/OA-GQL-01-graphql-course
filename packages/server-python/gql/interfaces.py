import graphene


class Node(graphene.Interface):
    """Interface commune avec un identifiant global."""

    id = graphene.ID(required=True)
