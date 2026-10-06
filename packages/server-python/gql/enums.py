import graphene


class EventCategory(graphene.Enum):
    SOCIAL = "SOCIAL"
    TECH = "TECH"
    MEETUP = "MEETUP"
    OTHER = "OTHER"


class Role(graphene.Enum):
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"
