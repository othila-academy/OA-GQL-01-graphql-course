import { gql } from 'apollo-server';

export const typeDefs = gql`
  interface Node { id: ID! }

  enum EventCategory { SOCIAL TECH MEETUP OTHER }

  type DateRange { start: String! end: String! }

  type User implements Node {
    id: ID!
    name: String!
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

  input DateRangeInput { start: String! end: String! }

  input CreateEventInput {
    title: String!
    description: String
    category: EventCategory!
    dateRange: DateRangeInput!
    organizerId: ID!
  }

  input UpdateEventInput {
    title: String
    description: String
    category: EventCategory
    dateRange: DateRangeInput
  }

  input CreateUserInput { name: String! }
  input UpdateUserInput { name: String }

  type Query {
    users: [User!]!
    events: [Event!]!
    user(id: ID!): User
    event(id: ID!): Event
    search(term: String!): [SearchResult!]!
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event!
    updateEvent(id: ID!, input: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Boolean!
    joinEvent(eventId: ID!, userId: ID!): Event!
    leaveEvent(eventId: ID!, userId: ID!): Event!
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
