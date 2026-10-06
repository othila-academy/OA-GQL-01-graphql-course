from graphql import GraphQLError


def not_found(type_name, id):
    return GraphQLError(f"{type_name} {id} introuvable", extensions={"code": "NOT_FOUND"})


def bad_input(message):
    return GraphQLError(message, extensions={"code": "BAD_USER_INPUT"})


def enum_value(value):
    """graphene 3 passe le membre de l'enum aux résolveurs ; on stocke sa valeur chaîne."""
    return getattr(value, "value", value)
