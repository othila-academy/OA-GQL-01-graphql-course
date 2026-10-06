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
