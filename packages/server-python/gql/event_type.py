import graphene

from data import repositories as repo
from .date_range import DateRange
from .enums import EventCategory
from .interfaces import Node


def _user():
    from .user_type import User

    return User


class Event(graphene.ObjectType):
    class Meta:
        interfaces = (Node,)

    title = graphene.String(required=True)
    description = graphene.String()
    category = graphene.Field(EventCategory, required=True)
    date_range = graphene.Field(DateRange, required=True)
    date = graphene.String(deprecation_reason="Use dateRange instead")
    organizer = graphene.Field(lambda: _user(), required=True)
    participants = graphene.List(graphene.NonNull(lambda: _user()), required=True)

    def resolve_date_range(root, info):
        return DateRange(start=root.start, end=root.end)

    def resolve_date(root, info):
        return root.start

    def resolve_organizer(root, info):
        return repo.find_user_by_id(root.organizer_id)

    def resolve_participants(root, info):
        users = (repo.find_user_by_id(pid) for pid in root.participant_ids)
        return [u for u in users if u is not None]
