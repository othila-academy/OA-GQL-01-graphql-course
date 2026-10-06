from dataclasses import dataclass, field


@dataclass
class UserModel:
    id: str
    name: str


@dataclass
class EventModel:
    id: str
    title: str
    category: str
    start: str
    end: str
    organizer_id: str
    participant_ids: list[str] = field(default_factory=list)
    description: str | None = None
