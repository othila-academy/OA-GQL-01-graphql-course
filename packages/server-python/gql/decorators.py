from functools import wraps

from auth.guards import require_auth, require_role


def auth_required(role=None):
    """Équivalent code-first de la directive @auth : vérifie l'utilisateur du contexte
    avant d'appeler le résolveur. graphene n'exécute pas les directives custom du SDL."""

    def decorator(resolver):
        @wraps(resolver)
        def wrapper(root, info, *args, **kwargs):
            if role:
                require_role(info, role)
            else:
                require_auth(info)
            return resolver(root, info, *args, **kwargs)

        return wrapper

    return decorator
