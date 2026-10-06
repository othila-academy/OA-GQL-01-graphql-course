class UserModel:
    def __init__(self, id: str, name: str):
        self.id = id
        self.name = name


class EventModel:
    def __init__(
        self,
        id: str,
        title: str,
        category: str,
        start: str,
        end: str,
        organizer_id: str,
        participant_ids: list[str],
    ):
        self.id = id
        self.title = title
        self.category = category
        self.start = start
        self.end = end
        self.organizer_id = organizer_id
        self.participant_ids = participant_ids


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
