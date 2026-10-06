import graphene
from .interfaces import Node
from .enums import EventCategory
from .date_range import DateRange
from data.repositories import find_user_by_id


class Event(graphene.ObjectType):
    class Meta:
        interfaces = (Node,)

    title = graphene.String(required=True)
    category = graphene.Field(EventCategory, required=True)
    date_range = graphene.Field(DateRange, required=True)
    date = graphene.String(deprecation_reason="Use dateRange instead")
    organizer = graphene.Field(lambda: "User", required=True)
    participants = graphene.List(lambda: "User", required=True)

    # Résolveurs de champs relationnels
    def resolve_organizer(self, info):
        return find_user_by_id(self.organizer_id)

    def resolve_participants(self, info):
        from data.repositories import find_user_by_id  # local import to avoid cycles

        return [find_user_by_id(pid) for pid in self.participant_ids]


def to_event(model):
    """Conversion d'un EventModel vers un objet Graphene Event (lazy relations)."""
    return Event(
        id=model.id,
        title=model.title,
        category=model.category,
        date_range=DateRange(start=model.start, end=model.end),
        date=model.start,
        organizer=None,
        participants=None,
        # Attributs internes utilisés par les resolvers relationnels
        organizer_id=model.organizer_id,
        participant_ids=model.participant_ids,
    )
