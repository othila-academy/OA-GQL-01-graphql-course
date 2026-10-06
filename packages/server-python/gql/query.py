import graphene

from data import repositories as repo
from .event_type import Event
from .unions import SearchResult
from .user_type import User


class Query(graphene.ObjectType):
    users = graphene.List(graphene.NonNull(User), required=True)
    events = graphene.List(graphene.NonNull(Event), required=True)
    search = graphene.List(
        graphene.NonNull(SearchResult), required=True, term=graphene.String(required=True)
    )

    def resolve_users(root, info):
        return repo.get_all_users()

    def resolve_events(root, info):
        return repo.get_all_events()

    def resolve_search(root, info, term):
        term = term.strip()
        if not term:
            return []
        return [*repo.search_users_by_name(term), *repo.search_events_by_title(term)]
