from .models import UserModel, EventModel

USERS = [
    UserModel("1", "Alice"),
    UserModel("2", "Bob"),
    UserModel("3", "Charlie"),
]

EVENTS = [
    EventModel(
        "101", "Soirée jeux", "SOCIAL", "2025-10-01", "2025-10-01", "1", ["1", "2"]
    ),
    EventModel("102", "Hackathon", "TECH", "2025-11-15", "2025-11-16", "2", ["2", "3"]),
]


def get_all_users():
    return USERS


def get_all_events():
    return EVENTS


def find_user_by_id(user_id: str):
    return next((u for u in USERS if u.id == user_id), None)


def search_users_by_name(term: str):
    lower = term.lower()
    return [u for u in USERS if lower in u.name.lower()]


def search_events_by_title(term: str):
    lower = term.lower()
    return [e for e in EVENTS if lower in e.title.lower()]


def get_events_organized_by_user(user_id: str):
    return [e for e in EVENTS if e.organizer_id == user_id]


def get_events_participated_by_user(user_id: str):
    return [e for e in EVENTS if user_id in e.participant_ids]
