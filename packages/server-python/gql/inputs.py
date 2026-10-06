import graphene

from .enums import EventCategory


class DateRangeInput(graphene.InputObjectType):
    start = graphene.String(required=True)
    end = graphene.String(required=True)


class CreateEventInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    category = EventCategory(required=True)
    date_range = DateRangeInput(required=True)
    organizer_id = graphene.ID(required=True)


class UpdateEventInput(graphene.InputObjectType):
    title = graphene.String()
    description = graphene.String()
    category = EventCategory()
    date_range = DateRangeInput()


class CreateUserInput(graphene.InputObjectType):
    name = graphene.String(required=True)


class UpdateUserInput(graphene.InputObjectType):
    name = graphene.String()
