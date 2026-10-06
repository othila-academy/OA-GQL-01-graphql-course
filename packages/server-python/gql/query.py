import graphene
from .user_type import User
from .event_type import to_event, Event
from .unions import SearchResult
from data.repositories import (
    get_all_users,
    get_all_events,
    search_users_by_name,
    search_events_by_title,
)


class Query(graphene.ObjectType):
    users = graphene.List(User, required=True)
    events = graphene.List(Event, required=True)
    search = graphene.List(
        SearchResult, term=graphene.String(required=True), required=True
    )

    def resolve_users(self, info):
        return [User(id=u.id, name=u.name) for u in get_all_users()]

    def resolve_events(self, info):
        return [to_event(e) for e in get_all_events()]

    def resolve_search(self, info, term):
        lower = term.strip()
        if not lower:
            return []
        matched_users = [
            User(id=u.id, name=u.name) for u in search_users_by_name(lower)
        ]
        matched_events = [to_event(e) for e in search_events_by_title(lower)]
        return matched_users + matched_events
