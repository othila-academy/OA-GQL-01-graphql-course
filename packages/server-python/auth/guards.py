from graphql import GraphQLError


def unauthenticated(message="Authentification requise"):
    return GraphQLError(message, extensions={"code": "UNAUTHENTICATED"})


def forbidden(message):
    return GraphQLError(message, extensions={"code": "FORBIDDEN"})


def require_auth(info):
    """Exige un utilisateur connecté et le renvoie."""
    user = info.context.get("user")
    if user is None:
        raise unauthenticated()
    return user


def require_role(info, role):
    """Exige le rôle donné ; un ADMIN passe toujours."""
    user = require_auth(info)
    if user.role != role and user.role != "ADMIN":
        raise forbidden(f"Rôle {role} requis")
    return user


def require_owner_or_admin(info, owner_id, message):
    """Exige d'être le propriétaire de la ressource (ou ADMIN)."""
    user = require_auth(info)
    if user.id != owner_id and user.role != "ADMIN":
        raise forbidden(message)
    return user
