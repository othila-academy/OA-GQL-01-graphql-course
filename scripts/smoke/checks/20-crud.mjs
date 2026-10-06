import { assert, expectData, expectErrorCode, loginAs } from '../runner.mjs';

const EVENT_FIELDS = 'id title description category dateRange { start end } organizer { id name } participants { id }';

export const checks = {
  'login renvoie un JWT pour Alice et Charlie': async ({ gql, state }) => {
    state.alice = await loginAs(gql, 'alice@example.com');
    state.charlie = await loginAs(gql, 'charlie@example.com');
    assert(state.alice.split('.').length === 3, 'un JWT a trois parties');
  },

  'createEvent (connecté) : je deviens l’organisateur': async ({ gql, state }) => {
    const data = expectData(
      await gql(`mutation Create($input: CreateEventInput!) { createEvent(input: $input) { ${EVENT_FIELDS} } }`, {
        token: state.charlie,
        variables: { input: { title: 'Atelier smoke', description: 'créé par le smoke test', category: 'TECH', dateRange: { start: '2026-12-01', end: '2026-12-02' } } }
      }),
      'createEvent'
    );
    assert(data.createEvent.organizer.name === 'Charlie', 'organisateur = utilisateur connecté');
    assert(data.createEvent.participants.length === 0, 'aucun participant à la création');
    state.eventId = data.createEvent.id;
  },

  'createEvent refuse une période incohérente et un titre vide (BAD_USER_INPUT)': async ({ gql, state }) => {
    expectErrorCode(
      await gql('mutation { createEvent(input: { title: "x", category: TECH, dateRange: { start: "2026-12-02", end: "2026-12-01" } }) { id } }', { token: state.charlie }),
      'BAD_USER_INPUT',
      'dates inversées'
    );
    expectErrorCode(
      await gql('mutation { createEvent(input: { title: "  ", category: TECH, dateRange: { start: "2026-12-01", end: "2026-12-01" } }) { id } }', { token: state.charlie }),
      'BAD_USER_INPUT',
      'titre vide'
    );
  },

  'updateEvent par l’organisateur : mise à jour partielle': async ({ gql, state }) => {
    const data = expectData(
      await gql(`mutation Update($id: ID!, $input: UpdateEventInput!) { updateEvent(id: $id, input: $input) { ${EVENT_FIELDS} } }`, {
        token: state.charlie,
        variables: { id: state.eventId, input: { title: 'Atelier smoke (modifié)' } }
      }),
      'updateEvent'
    );
    assert(data.updateEvent.title === 'Atelier smoke (modifié)', 'titre modifié');
    assert(data.updateEvent.category === 'TECH' && data.updateEvent.description === 'créé par le smoke test', 'autres champs conservés');
  },

  'joinEvent puis leaveEvent (Alice sur l’événement de Charlie), doublon refusé': async ({ gql, state }) => {
    const joined = expectData(
      await gql('mutation Join($id: ID!) { joinEvent(eventId: $id) { participants { id } } }', { token: state.alice, variables: { id: state.eventId } }),
      'joinEvent'
    );
    assert(joined.joinEvent.participants.some((p) => p.id === '1'), 'Alice inscrite');
    expectErrorCode(
      await gql('mutation Join($id: ID!) { joinEvent(eventId: $id) { id } }', { token: state.alice, variables: { id: state.eventId } }),
      'BAD_USER_INPUT',
      'double inscription'
    );
    const left = expectData(
      await gql('mutation Leave($id: ID!) { leaveEvent(eventId: $id) { participants { id } } }', { token: state.alice, variables: { id: state.eventId } }),
      'leaveEvent'
    );
    assert(left.leaveEvent.participants.length === 0, 'Alice désinscrite');
  },

  'event(id) retrouve l’événement, deleteEvent par l’organisateur, puis NOT_FOUND': async ({ gql, state }) => {
    const read = expectData(await gql('query One($id: ID!) { event(id: $id) { id } }', { variables: { id: state.eventId } }), 'event');
    assert(read.event?.id === state.eventId, 'event(id) le retrouve');
    const deleted = expectData(await gql('mutation Del($id: ID!) { deleteEvent(id: $id) }', { token: state.charlie, variables: { id: state.eventId } }), 'deleteEvent');
    assert(deleted.deleteEvent === true, 'true attendu');
    expectErrorCode(await gql('mutation Del($id: ID!) { deleteEvent(id: $id) }', { token: state.charlie, variables: { id: state.eventId } }), 'NOT_FOUND', 'second delete');
  },

  'createUser (public) crée un STUDENT, updateUser par lui-même, deleteUser par l’ADMIN': async ({ gql, state }) => {
    const created = expectData(
      await gql('mutation Reg($input: CreateUserInput!) { createUser(input: $input) { id name email role } }', {
        variables: { input: { name: 'Dana', email: 'Dana@Example.com', password: 'password123', role: 'ADMIN' } }
      }),
      'createUser'
    );
    assert(created.createUser.role === 'STUDENT', 'le rôle demandé par un anonyme est ignoré');
    assert(created.createUser.email === 'dana@example.com', 'email normalisé en minuscules');
    const dana = await loginAs(gql, 'dana@example.com');
    const updated = expectData(
      await gql('mutation Upd($id: ID!) { updateUser(id: $id, input: { name: "Dana B." }) { name } }', { token: dana, variables: { id: created.createUser.id } }),
      'updateUser'
    );
    assert(updated.updateUser.name === 'Dana B.', 'nom modifié');
    const deleted = expectData(
      await gql('mutation Del($id: ID!) { deleteUser(id: $id) }', { token: state.alice, variables: { id: created.createUser.id } }),
      'deleteUser'
    );
    assert(deleted.deleteUser === true, 'suppression OK');
  },

  'deleteUser refuse un organisateur (BAD_USER_INPUT)': async ({ gql, state }) => {
    expectErrorCode(await gql('mutation { deleteUser(id: "2") }', { token: state.alice }), 'BAD_USER_INPUT', 'Bob organise le Hackathon');
  }
};
