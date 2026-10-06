import graphene

from data import repositories as repo
from .errors import bad_input, enum_value, not_found
from .event_type import Event
from .inputs import CreateEventInput, CreateUserInput, UpdateEventInput, UpdateUserInput
from .user_type import User


def _validate_title(title):
    if not title or not title.strip():
        raise bad_input("Le titre est obligatoire")


def _validate_date_range(date_range):
    if date_range.end < date_range.start:
        raise bad_input("dateRange.end doit être postérieure ou égale à dateRange.start")


def _event_or_404(event_id):
    event = repo.find_event_by_id(event_id)
    if event is None:
        raise not_found("Event", event_id)
    return event


def _user_or_404(user_id):
    user = repo.find_user_by_id(user_id)
    if user is None:
        raise not_found("User", user_id)
    return user


class Mutation(graphene.ObjectType):
    create_event = graphene.Field(graphene.NonNull(Event), input=CreateEventInput(required=True))
    update_event = graphene.Field(graphene.NonNull(Event), id=graphene.ID(required=True),
                                  input=UpdateEventInput(required=True))
    delete_event = graphene.Field(graphene.Boolean, required=True, id=graphene.ID(required=True))
    join_event = graphene.Field(graphene.NonNull(Event), event_id=graphene.ID(required=True),
                                user_id=graphene.ID(required=True))
    leave_event = graphene.Field(graphene.NonNull(Event), event_id=graphene.ID(required=True),
                                 user_id=graphene.ID(required=True))
    create_user = graphene.Field(graphene.NonNull(User), input=CreateUserInput(required=True))
    update_user = graphene.Field(graphene.NonNull(User), id=graphene.ID(required=True),
                                 input=UpdateUserInput(required=True))
    delete_user = graphene.Field(graphene.Boolean, required=True, id=graphene.ID(required=True))

    def resolve_create_event(root, info, input):
        _validate_title(input.title)
        _validate_date_range(input.date_range)
        _user_or_404(input.organizer_id)
        return repo.create_event(
            title=input.title.strip(),
            description=input.description,
            category=enum_value(input.category),
            start=input.date_range.start,
            end=input.date_range.end,
            organizer_id=input.organizer_id,
        )

    def resolve_update_event(root, info, id, input):
        _event_or_404(id)
        fields = {}
        if input.title is not None:
            _validate_title(input.title)
            fields["title"] = input.title.strip()
        if input.description is not None:
            fields["description"] = input.description
        if input.category is not None:
            fields["category"] = enum_value(input.category)
        if input.date_range is not None:
            _validate_date_range(input.date_range)
            fields["start"] = input.date_range.start
            fields["end"] = input.date_range.end
        return repo.update_event(id, **fields)

    def resolve_delete_event(root, info, id):
        _event_or_404(id)
        return repo.delete_event(id)

    def resolve_join_event(root, info, event_id, user_id):
        event = _event_or_404(event_id)
        _user_or_404(user_id)
        if user_id in event.participant_ids:
            raise bad_input("Utilisateur déjà inscrit à cet événement")
        return repo.add_participant(event_id, user_id)

    def resolve_leave_event(root, info, event_id, user_id):
        event = _event_or_404(event_id)
        _user_or_404(user_id)
        if user_id not in event.participant_ids:
            raise bad_input("Utilisateur non inscrit à cet événement")
        return repo.remove_participant(event_id, user_id)

    def resolve_create_user(root, info, input):
        if not input.name or not input.name.strip():
            raise bad_input("Le nom est obligatoire")
        return repo.create_user(name=input.name.strip())

    def resolve_update_user(root, info, id, input):
        _user_or_404(id)
        if input.name is not None and not input.name.strip():
            raise bad_input("Le nom est obligatoire")
        return repo.update_user(id, name=input.name.strip() if input.name is not None else None)

    def resolve_delete_user(root, info, id):
        _user_or_404(id)
        if repo.get_events_organized_by_user(id):
            raise bad_input("Impossible de supprimer un utilisateur qui organise encore des événements")
        repo.remove_user_from_all_events(id)
        return repo.delete_user(id)
