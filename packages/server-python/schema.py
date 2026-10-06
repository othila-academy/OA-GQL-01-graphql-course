import graphene
from data import USERS, EVENTS, EventModel


# Interfaces
class Node(graphene.Interface):
    id = graphene.ID(required=True)


# Enums
class EventCategory(graphene.Enum):
    SOCIAL = "SOCIAL"
    TECH = "TECH"
    MEETUP = "MEETUP"
    OTHER = "OTHER"


# Embedded Object
class DateRange(graphene.ObjectType):
    start = graphene.String(required=True)
    end = graphene.String(required=True)


# Forward declarations (for type hints)
class User(graphene.ObjectType):
    class Meta:
        interfaces = (Node,)

    name = graphene.String(required=True)
    organized_events = graphene.List(lambda: "Event")
    participating_events = graphene.List(lambda: "Event")

    def resolve_organized_events(self, info):
        from data import EVENTS

        return [e for e in EVENTS if e.organizer_id == self.id]

    def resolve_participating_events(self, info):
        from data import EVENTS

        return [e for e in EVENTS if self.id in e.participant_ids]


class Event(graphene.ObjectType):
    class Meta:
        interfaces = (Node,)

    title = graphene.String(required=True)
    category = graphene.Field(EventCategory, required=True)
    date_range = graphene.Field(DateRange, required=True)
    # Deprecated legacy field
    date = graphene.String(deprecation_reason="Use dateRange instead")
    organizer = graphene.Field(User, required=True)
    participants = graphene.List(User, required=True)

    def resolve_organizer(self, info):
        from data import USERS

        return next(u for u in USERS if u.id == self.organizer_id)

    def resolve_participants(self, info):
        from data import USERS

        return [next(u for u in USERS if u.id == pid) for pid in self.participant_ids]


# Union
class SearchResult(graphene.Union):
    class Meta:
        types = (User, Event)


# In-memory data layer
def _event_to_graphene(e: EventModel):
    return Event(
        id=e.id,
        title=e.title,
        category=e.category,
        date_range=DateRange(start=e.start, end=e.end),
        date=e.start,
        organizer=None,
        participants=None,
    )


# Query Root
class Query(graphene.ObjectType):
    users = graphene.List(User, required=True)
    events = graphene.List(Event, required=True)
    search = graphene.List(
        SearchResult, term=graphene.String(required=True), required=True
    )

    def resolve_users(self, info):
        return [User(id=u.id, name=u.name) for u in USERS]

    def resolve_events(self, info):
        return [_event_to_graphene(e) for e in EVENTS]

    def resolve_search(self, info, term):
        lower = term.lower()
        matched_users = [
            User(id=u.id, name=u.name) for u in USERS if lower in u.name.lower()
        ]
        matched_events = [
            _event_to_graphene(e) for e in EVENTS if lower in e.title.lower()
        ]
        return matched_users + matched_events


schema = graphene.Schema(query=Query, types=[User, Event])
