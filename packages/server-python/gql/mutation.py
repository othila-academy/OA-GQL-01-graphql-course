import re

import graphene
from werkzeug.security import check_password_hash, generate_password_hash

from auth.guards import require_auth, require_owner_or_admin, require_role, unauthenticated
from auth.jwt_utils import sign_token
from data import repositories as repo
from .auth_payload import AuthPayload
from .errors import bad_input, enum_value, not_found
from .event_type import Event
from .inputs import CreateEventInput, CreateUserInput, UpdateEventInput, UpdateUserInput
from .user_type import User

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _validate_title(title):
    if not title or not title.strip():
        raise bad_input("Le titre est obligatoire")


def _validate_date_range(date_range):
    if date_range.end < date_range.start:
        raise bad_input("dateRange.end doit être postérieure ou égale à dateRange.start")


def _normalize_email(email, exclude_user_id=None):
    """Minuscules, sans espaces, format vérifié, unicité garantie."""
    normalized = (email or "").strip().lower()
    if not EMAIL_RE.match(normalized):
        raise bad_input("Email invalide")
    existing = repo.find_user_by_email(normalized)
    if existing is not None and existing.id != exclude_user_id:
        raise bad_input("Cet email est déjà utilisé")
    return normalized


def _event_or_404(event_id):
    event = repo.find_event_by_id(event_id)
    if event is None:
        raise not_found("Event", event_id)
    return event


def _user_or_404(user_id):
    user = repo.find_user_by_id(user_id)
    if user is None:
        raise not_found("User", user_id)
    return user


class Mutation(graphene.ObjectType):
    create_event = graphene.Field(graphene.NonNull(Event), input=CreateEventInput(required=True))
    update_event = graphene.Field(graphene.NonNull(Event), id=graphene.ID(required=True),
                                  input=UpdateEventInput(required=True))
    delete_event = graphene.Field(graphene.Boolean, required=True, id=graphene.ID(required=True))
    join_event = graphene.Field(graphene.NonNull(Event), event_id=graphene.ID(required=True))
    leave_event = graphene.Field(graphene.NonNull(Event), event_id=graphene.ID(required=True))
    create_user = graphene.Field(graphene.NonNull(User), input=CreateUserInput(required=True))
    update_user = graphene.Field(graphene.NonNull(User), id=graphene.ID(required=True),
                                 input=UpdateUserInput(required=True))
    delete_user = graphene.Field(graphene.Boolean, required=True, id=graphene.ID(required=True))
    login = graphene.Field(graphene.NonNull(AuthPayload), email=graphene.String(required=True),
                           password=graphene.String(required=True))

    def resolve_login(root, info, email, password):
        user = repo.find_user_by_email(email.strip().lower())
        if user is None or not check_password_hash(user.password_hash, password):
            raise unauthenticated("Identifiants invalides")
        return AuthPayload(token=sign_token(user), user=user)

    def resolve_create_event(root, info, input):
        me = require_auth(info)
        _validate_title(input.title)
        _validate_date_range(input.date_range)
        return repo.create_event(
            title=input.title.strip(),
            description=input.description,
            category=enum_value(input.category),
            start=input.date_range.start,
            end=input.date_range.end,
            organizer_id=me.id,
        )

    def resolve_update_event(root, info, id, input):
        event = _event_or_404(id)
        require_owner_or_admin(info, event.organizer_id,
                               "Seul l'organisateur ou un ADMIN peut modifier cet événement")
        fields = {}
        if input.title is not None:
            _validate_title(input.title)
            fields["title"] = input.title.strip()
        if input.description is not None:
            fields["description"] = input.description
        if input.category is not None:
            fields["category"] = enum_value(input.category)
        if input.date_range is not None:
            _validate_date_range(input.date_range)
            fields["start"] = input.date_range.start
            fields["end"] = input.date_range.end
        return repo.update_event(id, **fields)

    def resolve_delete_event(root, info, id):
        event = _event_or_404(id)
        require_owner_or_admin(info, event.organizer_id,
                               "Seul l'organisateur ou un ADMIN peut supprimer cet événement")
        return repo.delete_event(id)

    def resolve_join_event(root, info, event_id):
        me = require_auth(info)
        event = _event_or_404(event_id)
        if me.id in event.participant_ids:
            raise bad_input("Vous êtes déjà inscrit à cet événement")
        return repo.add_participant(event_id, me.id)

    def resolve_leave_event(root, info, event_id):
        me = require_auth(info)
        event = _event_or_404(event_id)
        if me.id not in event.participant_ids:
            raise bad_input("Vous n'êtes pas inscrit à cet événement")
        return repo.remove_participant(event_id, me.id)

    def resolve_create_user(root, info, input):
        if not input.name or not input.name.strip():
            raise bad_input("Le nom est obligatoire")
        if not input.password or len(input.password) < 8:
            raise bad_input("Le mot de passe doit faire au moins 8 caractères")
        email = _normalize_email(input.email)
        current = info.context.get("user")
        # Seul un ADMIN connecté peut choisir le rôle ; sinon STUDENT.
        role = enum_value(input.role) if (current is not None and current.role == "ADMIN" and input.role) else "STUDENT"
        return repo.create_user(name=input.name.strip(), email=email, role=role,
                                password_hash=generate_password_hash(input.password))

    def resolve_update_user(root, info, id, input):
        _user_or_404(id)
        require_owner_or_admin(info, id, "Seul l'utilisateur lui-même ou un ADMIN peut modifier ce profil")
        if input.role is not None:
            require_role(info, "ADMIN")
        if input.name is not None and not input.name.strip():
            raise bad_input("Le nom est obligatoire")
        return repo.update_user(
            id,
            name=input.name.strip() if input.name is not None else None,
            email=_normalize_email(input.email, id) if input.email is not None else None,
            role=enum_value(input.role) if input.role is not None else None,
        )

    def resolve_delete_user(root, info, id):
        require_role(info, "ADMIN")
        _user_or_404(id)
        if repo.get_events_organized_by_user(id):
            raise bad_input("Impossible de supprimer un utilisateur qui organise encore des événements")
        repo.remove_user_from_all_events(id)
        return repo.delete_user(id)
