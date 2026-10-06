import { assert, expectData, expectErrorCode, loginAs } from '../runner.mjs';

export const badges = ['Security Guardian'];

export const checks = {
  'sans token, createEvent est refusé (UNAUTHENTICATED)': async ({ gql }) => {
    expectErrorCode(
      await gql('mutation { createEvent(input: { title: "x", category: TECH, dateRange: { start: "2026-12-01", end: "2026-12-01" } }) { id } }'),
      'UNAUTHENTICATED',
      'createEvent anonyme'
    );
  },

  'mauvais mot de passe : UNAUTHENTICATED': async ({ gql }) => {
    expectErrorCode(
      await gql('mutation { login(email: "alice@example.com", password: "nope") { token } }'),
      'UNAUTHENTICATED',
      'login refusé'
    );
  },

  'un token forgé est traité comme anonyme : me est refusé proprement (UNAUTHENTICATED)': async ({ gql }) => {
    const result = await gql('{ me { id } }', { token: 'ceci.nest.pas.un.jwt' });
    assert(result.errors?.[0]?.extensions?.code === 'UNAUTHENTICATED', 'UNAUTHENTICATED attendu, jamais une erreur interne');
    const anonymous = await gql('{ events { id } }', { token: 'ceci.nest.pas.un.jwt' });
    assert(!anonymous.errors, 'les lectures publiques restent accessibles avec un token invalide');
  },

  'me renvoie l’utilisateur connecté': async ({ gql, state }) => {
    state.alice = await loginAs(gql, 'alice@example.com');
    const data = expectData(await gql('{ me { id name role email } }', { token: state.alice }), 'me');
    assert(data.me.name === 'Alice' && data.me.role === 'ADMIN', 'Alice ADMIN attendue');
  },

  'l’email est insensible à la casse et aux espaces au login': async ({ gql }) => {
    await loginAs(gql, '  ALICE@Example.com  ');
  },

  'Charlie (STUDENT) ne peut pas supprimer l’événement de Bob (FORBIDDEN)': async ({ gql, state }) => {
    state.charlie = await loginAs(gql, 'charlie@example.com');
    expectErrorCode(await gql('mutation { deleteEvent(id: "102") }', { token: state.charlie }), 'FORBIDDEN', 'delete 102');
    expectErrorCode(await gql('mutation { updateEvent(id: "102", input: { title: "pirate" }) { id } }', { token: state.charlie }), 'FORBIDDEN', 'update 102');
  },

  'Charlie ne peut ni modifier Bob, ni changer son propre rôle, ni supprimer (FORBIDDEN)': async ({ gql, state }) => {
    expectErrorCode(await gql('mutation { updateUser(id: "2", input: { name: "Bobby" }) { id } }', { token: state.charlie }), 'FORBIDDEN', 'update Bob');
    expectErrorCode(await gql('mutation { updateUser(id: "3", input: { role: ADMIN }) { id } }', { token: state.charlie }), 'FORBIDDEN', 'auto-promotion');
    expectErrorCode(await gql('mutation { deleteUser(id: "3") }', { token: state.charlie }), 'FORBIDDEN', 'delete par STUDENT');
  },

  'l’ADMIN peut modifier le rôle d’un autre utilisateur': async ({ gql, state }) => {
    const data = expectData(await gql('mutation { updateUser(id: "3", input: { role: TEACHER }) { role } }', { token: state.alice }), 'promotion');
    assert(data.updateUser.role === 'TEACHER', 'Charlie promu TEACHER');
    expectData(await gql('mutation { updateUser(id: "3", input: { role: STUDENT }) { role } }', { token: state.alice }), 'retour à STUDENT');
  },

  'createUser refuse un email déjà pris ou un mot de passe trop court (BAD_USER_INPUT)': async ({ gql }) => {
    expectErrorCode(
      await gql('mutation { createUser(input: { name: "Clone", email: "ALICE@example.com", password: "password123" }) { id } }'),
      'BAD_USER_INPUT',
      'email déjà pris, casse différente'
    );
    expectErrorCode(
      await gql('mutation { createUser(input: { name: "Court", email: "court@example.com", password: "1234567" }) { id } }'),
      'BAD_USER_INPUT',
      'mot de passe trop court'
    );
  },

  'supprimer un utilisateur le retire des participants': async ({ gql, state }) => {
    const created = expectData(
      await gql('mutation { createUser(input: { name: "Eve", email: "eve@example.com", password: "password123" }) { id } }'),
      'createUser Eve'
    );
    const eve = await loginAs(gql, 'eve@example.com');
    expectData(await gql('mutation { joinEvent(eventId: "101") { id } }', { token: eve }), 'Eve rejoint 101');
    expectData(await gql('mutation Del($id: ID!) { deleteUser(id: $id) }', { token: state.alice, variables: { id: created.createUser.id } }), 'delete Eve');
    const event = expectData(await gql('{ event(id: "101") { participants { id } } }'), 'event 101');
    assert(!event.event.participants.some((p) => p.id === created.createUser.id), 'Eve retirée des participants');
    assert(event.event.participants.length === 2, 'les deux participants de départ restent');
  },

  'le hash du mot de passe n’est exposé par aucun champ du schéma': async ({ gql }) => {
    const result = await gql('{ users { passwordHash } }');
    assert(result.errors?.length === 1, 'erreur de validation attendue');
  },

  'les erreurs attendues ne transportent ni stack trace ni détail interne': async ({ gql }) => {
    const result = await gql('mutation { login(email: "alice@example.com", password: "nope") { token } }');
    const [error] = result.errors;
    assert(error.extensions.code === 'UNAUTHENTICATED', 'UNAUTHENTICATED attendu');
    assert(error.extensions.exception === undefined, 'extensions.exception (stack trace Apollo) ne doit pas être renvoyé');
    assert(Object.keys(error.extensions).join(',') === 'code', 'extensions ne contient que le code');
    const validation = await gql('{ events { location } }');
    assert(validation.errors[0].extensions?.exception === undefined, 'pas de stack trace sur une erreur de validation non plus');
  }
};
