import { assert, expectData } from '../runner.mjs';

export const checks = {
  'users renvoie les utilisateurs de départ': async ({ gql }) => {
    const data = expectData(await gql('{ users { id name } }'), 'users');
    assert(data.users.length >= 3, 'au moins trois utilisateurs attendus');
    assert(data.users.some((u) => u.name === 'Alice'), 'Alice attendue');
  },

  'events expose dateRange, organizer et participants': async ({ gql }) => {
    const data = expectData(
      await gql('{ events { id title category dateRange { start end } organizer { id name } participants { id name } } }'),
      'events'
    );
    const hackathon = data.events.find((e) => e.title === 'Hackathon');
    assert(hackathon, 'événement Hackathon attendu');
    assert(hackathon.category === 'TECH', 'catégorie TECH attendue');
    assert(hackathon.organizer.name === 'Bob', 'Bob organise le Hackathon');
    assert(hackathon.participants.length === 2, 'deux participants attendus au Hackathon');
    assert(hackathon.dateRange.start < hackathon.dateRange.end, 'période sur deux jours');
  },

  'search renvoie une union User | Event': async ({ gql }) => {
    const data = expectData(
      await gql('{ search(term: "a") { __typename ... on User { name } ... on Event { title } } }'),
      'search'
    );
    assert(data.search.some((r) => r.__typename === 'User'), 'au moins un User');
    assert(data.search.some((r) => r.__typename === 'Event'), 'au moins un Event');
  },

  'un champ absent du schéma est refusé par la validation': async ({ gql }) => {
    const result = await gql('{ events { location } }');
    assert(result.errors?.length === 1, 'une erreur de validation attendue');
    assert(/location/.test(result.errors[0].message), 'le message cite le champ fautif');
  }
};
