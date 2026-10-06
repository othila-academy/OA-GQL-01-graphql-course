from .models import EventModel, UserModel

USERS = [
    UserModel("1", "Alice"),
    UserModel("2", "Bob"),
    UserModel("3", "Charlie"),
]

EVENTS = [
    EventModel("101", "Soirée jeux", "SOCIAL", "2026-10-20", "2026-10-20", "1", ["1", "2"],
               "Jeux de société et pizzas au foyer."),
    EventModel("102", "Hackathon", "TECH", "2026-11-14", "2026-11-15", "2", ["2", "3"],
               "48 h pour prototyper une appli GraphQL."),
]


def _next_id(items):
    return str(max((int(item.id) for item in items), default=0) + 1)


# --- lectures -----------------------------------------------------------

def get_all_users():
    return USERS


def get_all_events():
    return EVENTS


def find_user_by_id(user_id):
    return next((u for u in USERS if u.id == user_id), None)


def find_event_by_id(event_id):
    return next((e for e in EVENTS if e.id == event_id), None)


def search_users_by_name(term):
    lower = term.lower()
    return [u for u in USERS if lower in u.name.lower()]


def search_events_by_title(term):
    lower = term.lower()
    return [e for e in EVENTS if lower in e.title.lower()]


def get_events_organized_by_user(user_id):
    return [e for e in EVENTS if e.organizer_id == user_id]


def get_events_participated_by_user(user_id):
    return [e for e in EVENTS if user_id in e.participant_ids]


# --- écritures ----------------------------------------------------------

def create_event(*, title, description, category, start, end, organizer_id):
    event = EventModel(_next_id(EVENTS), title, category, start, end, organizer_id, [], description)
    EVENTS.append(event)
    return event


def update_event(event_id, **fields):
    """Met à jour les champs fournis ; None signifie « inchangé »."""
    event = find_event_by_id(event_id)
    for key, value in fields.items():
        if value is not None:
            setattr(event, key, value)
    return event


def delete_event(event_id):
    event = find_event_by_id(event_id)
    if event is None:
        return False
    EVENTS.remove(event)
    return True


def add_participant(event_id, user_id):
    event = find_event_by_id(event_id)
    event.participant_ids.append(user_id)
    return event


def remove_participant(event_id, user_id):
    event = find_event_by_id(event_id)
    event.participant_ids = [pid for pid in event.participant_ids if pid != user_id]
    return event


def remove_user_from_all_events(user_id):
    for event in EVENTS:
        event.participant_ids = [pid for pid in event.participant_ids if pid != user_id]


def create_user(**fields):
    user = UserModel(_next_id(USERS), **fields)
    USERS.append(user)
    return user


def update_user(user_id, **fields):
    user = find_user_by_id(user_id)
    for key, value in fields.items():
        if value is not None:
            setattr(user, key, value)
    return user


def delete_user(user_id):
    user = find_user_by_id(user_id)
    if user is None:
        return False
    USERS.remove(user)
    return True
