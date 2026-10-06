import graphene
from .interfaces import Node
from data.repositories import (
    get_events_organized_by_user,
    get_events_participated_by_user,
)
from .event_type import to_event


class User(graphene.ObjectType):
    class Meta:
        interfaces = (Node,)

    name = graphene.String(required=True)
    organized_events = graphene.List(lambda: "Event")
    participating_events = graphene.List(lambda: "Event")

    def resolve_organized_events(self, info):
        return [to_event(e) for e in get_events_organized_by_user(self.id)]

    def resolve_participating_events(self, info):
        return [to_event(e) for e in get_events_participated_by_user(self.id)]
