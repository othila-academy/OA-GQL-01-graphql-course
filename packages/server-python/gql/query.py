import graphene

from data import repositories as repo
from .decorators import auth_required
from .errors import bad_input
from .event_type import Event
from .unions import SearchResult
from .user_type import User


class Query(graphene.ObjectType):
    users = graphene.List(graphene.NonNull(User), required=True)
    events = graphene.List(
        graphene.NonNull(Event), required=True,
        limit=graphene.Int(default_value=10), offset=graphene.Int(default_value=0),
    )
    events_count = graphene.Int(required=True)
    search = graphene.List(
        graphene.NonNull(SearchResult), required=True, term=graphene.String(required=True)
    )
    user = graphene.Field(User, id=graphene.ID(required=True))
    event = graphene.Field(Event, id=graphene.ID(required=True))
    me = graphene.Field(User)

    def resolve_users(root, info):
        return repo.get_all_users()

    def resolve_events(root, info, limit, offset):
        if limit < 1 or limit > 50:
            raise bad_input("limit doit être compris entre 1 et 50")
        if offset < 0:
            raise bad_input("offset doit être positif ou nul")
        return repo.get_all_events()[offset:offset + limit]

    def resolve_events_count(root, info):
        return len(repo.get_all_events())

    def resolve_user(root, info, id):
        return repo.find_user_by_id(id)

    def resolve_event(root, info, id):
        return repo.find_event_by_id(id)

    def resolve_search(root, info, term):
        term = term.strip()
        if not term:
            return []
        return [*repo.search_users_by_name(term), *repo.search_events_by_title(term)]

    @auth_required()
    def resolve_me(root, info):
        return info.context["user"]
