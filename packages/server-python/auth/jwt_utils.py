import os
import time

import jwt

from data import repositories as repo

# En production le secret vient de l'environnement ; la valeur par défaut sert au cours.
SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-me")
TTL_SECONDS = 2 * 3600


def sign_token(user):
    payload = {"sub": user.id, "role": user.role, "exp": int(time.time()) + TTL_SECONDS}
    return jwt.encode(payload, SECRET, algorithm="HS256")


def decode_token(token):
    return jwt.decode(token, SECRET, algorithms=["HS256"])


def user_from_request(request):
    """Lit `Authorization: Bearer <token>` ; absent, invalide ou expiré → anonyme (None)."""
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    try:
        payload = decode_token(header[len("Bearer "):])
    except jwt.PyJWTError:
        return None
    return repo.find_user_by_id(payload.get("sub"))
