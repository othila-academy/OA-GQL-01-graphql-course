import { assert, expectData, expectErrorCode } from '../runner.mjs';

const EVENT_FIELDS = 'id title description category dateRange { start end } organizer { id name } participants { id }';

export const checks = {
  'createEvent crée un événement complet': async ({ gql, state }) => {
    const data = expectData(
      await gql(`mutation Create($input: CreateEventInput!) { createEvent(input: $input) { ${EVENT_FIELDS} } }`, {
        variables: { input: { title: 'Atelier smoke', description: 'créé par le smoke test', category: 'TECH', dateRange: { start: '2026-12-01', end: '2026-12-02' }, organizerId: '3' } }
      }),
      'createEvent'
    );
    const event = data.createEvent;
    assert(event.id && event.title === 'Atelier smoke', 'titre attendu');
    assert(event.organizer.name === 'Charlie', 'organisateur Charlie attendu');
    assert(event.participants.length === 0, 'aucun participant à la création');
    state.eventId = event.id;
  },

  'createEvent refuse une période incohérente (BAD_USER_INPUT)': async ({ gql }) => {
    expectErrorCode(
      await gql('mutation { createEvent(input: { title: "x", category: TECH, dateRange: { start: "2026-12-02", end: "2026-12-01" }, organizerId: "1" }) { id } }'),
      'BAD_USER_INPUT',
      'dates inversées'
    );
    expectErrorCode(
      await gql('mutation { createEvent(input: { title: "   ", category: TECH, dateRange: { start: "2026-12-01", end: "2026-12-01" }, organizerId: "1" }) { id } }'),
      'BAD_USER_INPUT',
      'titre vide'
    );
  },

  'createEvent refuse un organisateur inconnu (NOT_FOUND)': async ({ gql }) => {
    expectErrorCode(
      await gql('mutation { createEvent(input: { title: "x", category: TECH, dateRange: { start: "2026-12-01", end: "2026-12-01" }, organizerId: "999" }) { id } }'),
      'NOT_FOUND',
      'organisateur 999'
    );
  },

  'updateEvent modifie le titre et conserve le reste': async ({ gql, state }) => {
    const data = expectData(
      await gql(`mutation Update($id: ID!, $input: UpdateEventInput!) { updateEvent(id: $id, input: $input) { ${EVENT_FIELDS} } }`, {
        variables: { id: state.eventId, input: { title: 'Atelier smoke (modifié)' } }
      }),
      'updateEvent'
    );
    assert(data.updateEvent.title === 'Atelier smoke (modifié)', 'titre modifié');
    assert(data.updateEvent.category === 'TECH', 'catégorie conservée');
    assert(data.updateEvent.description === 'créé par le smoke test', 'description conservée');
  },

  'joinEvent puis leaveEvent, doublon refusé': async ({ gql, state }) => {
    const joined = expectData(
      await gql('mutation Join($eventId: ID!, $userId: ID!) { joinEvent(eventId: $eventId, userId: $userId) { participants { id } } }', {
        variables: { eventId: state.eventId, userId: '1' }
      }),
      'joinEvent'
    );
    assert(joined.joinEvent.participants.some((p) => p.id === '1'), 'Alice inscrite');
    expectErrorCode(
      await gql('mutation Join($eventId: ID!, $userId: ID!) { joinEvent(eventId: $eventId, userId: $userId) { id } }', {
        variables: { eventId: state.eventId, userId: '1' }
      }),
      'BAD_USER_INPUT',
      'double inscription'
    );
    const left = expectData(
      await gql('mutation Leave($eventId: ID!, $userId: ID!) { leaveEvent(eventId: $eventId, userId: $userId) { participants { id } } }', {
        variables: { eventId: state.eventId, userId: '1' }
      }),
      'leaveEvent'
    );
    assert(left.leaveEvent.participants.length === 0, 'Alice désinscrite');
  },

  'event(id) retrouve l’événement, deleteEvent le supprime, puis NOT_FOUND': async ({ gql, state }) => {
    const read = expectData(await gql('query One($id: ID!) { event(id: $id) { id } }', { variables: { id: state.eventId } }), 'event');
    assert(read.event?.id === state.eventId, 'event(id) le retrouve');
    const deleted = expectData(await gql('mutation Del($id: ID!) { deleteEvent(id: $id) }', { variables: { id: state.eventId } }), 'deleteEvent');
    assert(deleted.deleteEvent === true, 'true attendu');
    expectErrorCode(await gql('mutation Del($id: ID!) { deleteEvent(id: $id) }', { variables: { id: state.eventId } }), 'NOT_FOUND', 'second delete');
    const gone = expectData(await gql('query One($id: ID!) { event(id: $id) { id } }', { variables: { id: state.eventId } }), 'event après suppression');
    assert(gone.event === null, 'event(id) vaut null après suppression');
  },

  'createUser, updateUser, deleteUser': async ({ gql }) => {
    const created = expectData(
      await gql('mutation { createUser(input: { name: "Dana" }) { id name } }'),
      'createUser'
    );
    assert(created.createUser.name === 'Dana', 'Dana créée');
    const updated = expectData(
      await gql('mutation Upd($id: ID!) { updateUser(id: $id, input: { name: "Dana B." }) { name } }', { variables: { id: created.createUser.id } }),
      'updateUser'
    );
    assert(updated.updateUser.name === 'Dana B.', 'nom modifié');
    const deleted = expectData(
      await gql('mutation Del($id: ID!) { deleteUser(id: $id) }', { variables: { id: created.createUser.id } }),
      'deleteUser'
    );
    assert(deleted.deleteUser === true, 'suppression OK');
    expectErrorCode(await gql('mutation Del($id: ID!) { deleteUser(id: $id) }', { variables: { id: created.createUser.id } }), 'NOT_FOUND', 'second delete');
  },

  'deleteUser refuse un organisateur (BAD_USER_INPUT)': async ({ gql }) => {
    expectErrorCode(await gql('mutation { deleteUser(id: "2") }'), 'BAD_USER_INPUT', 'Bob organise le Hackathon');
  }
};
