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
    category: EventCategory!
    dateRange: DateRange!
    date: String @deprecated(reason: "Use dateRange instead")
    organizer: User!
    participants: [User!]!
  }

  union SearchResult = User | Event

  type Query {
    users: [User!]!
    events: [Event!]!
    search(term: String!): [SearchResult!]!
  }
`;
