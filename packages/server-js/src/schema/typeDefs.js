import { gql } from 'apollo-server';

export const typeDefs = gql`
  """
  Exige un utilisateur connecté ; avec \`requires\`, exige ce rôle (un ADMIN passe toujours).
  Les règles de propriété (organisateur, soi-même) restent dans les résolveurs :
  une directive ne connaît pas la ressource visée.
  """
  directive @auth(requires: Role) on FIELD_DEFINITION | OBJECT

  interface Node { id: ID! }

  enum EventCategory { SOCIAL TECH MEETUP OTHER }
  enum Role { ADMIN STUDENT TEACHER }

  type DateRange { start: String! end: String! }

  type User implements Node {
    id: ID!
    name: String!
    email: String!
    role: Role!
    organizedEvents: [Event!]!
    participatingEvents: [Event!]!
  }

  type Event implements Node {
    id: ID!
    title: String!
    description: String
    category: EventCategory!
    dateRange: DateRange!
    date: String @deprecated(reason: "Use dateRange instead")
    organizer: User!
    participants: [User!]!
  }

  union SearchResult = User | Event

  type AuthPayload { token: String! user: User! }

  input DateRangeInput { start: String! end: String! }

  input CreateEventInput {
    title: String!
    description: String
    category: EventCategory!
    dateRange: DateRangeInput!
  }

  input UpdateEventInput {
    title: String
    description: String
    category: EventCategory
    dateRange: DateRangeInput
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: Role
  }

  input UpdateUserInput {
    name: String
    email: String
    role: Role
  }

  type Query {
    users: [User!]!
    events: [Event!]!
    user(id: ID!): User
    event(id: ID!): Event
    search(term: String!): [SearchResult!]!
    me: User @auth
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event! @auth
    updateEvent(id: ID!, input: UpdateEventInput!): Event! @auth
    deleteEvent(id: ID!): Boolean! @auth
    joinEvent(eventId: ID!): Event! @auth
    leaveEvent(eventId: ID!): Event! @auth
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User! @auth
    deleteUser(id: ID!): Boolean! @auth(requires: ADMIN)
    login(email: String!, password: String!): AuthPayload!
  }
`;
