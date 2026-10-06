import graphene


class EventCategory(graphene.Enum):
    SOCIAL = "SOCIAL"
    TECH = "TECH"
    MEETUP = "MEETUP"
    OTHER = "OTHER"
