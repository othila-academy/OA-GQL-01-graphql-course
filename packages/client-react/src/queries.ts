import { gql } from '@apollo/client';

// ---- Types miroir du schéma (voir packages/server-js/src/schema/typeDefs.js) ----

export type Role = 'ADMIN' | 'STUDENT' | 'TEACHER';
export type EventCategory = 'SOCIAL' | 'TECH' | 'MEETUP' | 'OTHER';
export const ROLES: Role[] = ['STUDENT', 'TEACHER', 'ADMIN'];
export const CATEGORIES: EventCategory[] = ['SOCIAL', 'TECH', 'MEETUP', 'OTHER'];

export interface DateRange { start: string; end: string }

export interface UserInfo { id: string; name: string; email: string; role: Role }

export interface EventSummary {
  id: string;
  title: string;
  description: string | null;
  category: EventCategory;
  dateRange: DateRange;
  organizer: UserInfo;
  participants: UserInfo[];
}

/** Version allégée utilisée dans le profil d'un utilisateur. */
export interface EventRef { id: string; title: string; category: EventCategory; dateRange: DateRange; participants: { id: string }[] }

export interface EventsData { events: EventSummary[] }
export interface EventData { event: EventSummary | null }
export interface UsersData { users: UserInfo[] }
export interface UserDetailsData { user: (UserInfo & { organizedEvents: EventRef[]; participatingEvents: EventRef[] }) | null }
export interface MeData { me: UserInfo | null }
export interface LoginData { login: { token: string; user: UserInfo } }

export interface CreateEventInput { title: string; description?: string | null; category: EventCategory; dateRange: DateRange }
export interface UpdateEventInput { title?: string; description?: string | null; category?: EventCategory; dateRange?: DateRange }
export interface CreateUserInput { name: string; email: string; password: string; role?: Role }
export interface UpdateUserInput { name?: string; email?: string; role?: Role }

// ---- Fragments ----

export const USER_INFO = gql`
  fragment UserInfo on User { id name email role }
`;

export const EVENT_SUMMARY = gql`
  fragment EventSummary on Event {
    id title description category
    dateRange { start end }
    organizer { ...UserInfo }
    participants { ...UserInfo }
  }
  ${USER_INFO}
`;

// ---- Queries ----

export const GET_EVENTS = gql`
  query GetEvents { events { ...EventSummary } }
  ${EVENT_SUMMARY}
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) { event(id: $id) { ...EventSummary } }
  ${EVENT_SUMMARY}
`;

export const GET_USERS = gql`
  query GetUsers { users { ...UserInfo } }
  ${USER_INFO}
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserInfo
      organizedEvents { id title category dateRange { start end } participants { id } }
      participatingEvents { id title category dateRange { start end } participants { id } }
    }
  }
  ${USER_INFO}
`;

export const ME = gql`
  query Me { me { ...UserInfo } }
  ${USER_INFO}
`;

// ---- Mutations ----

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) { token user { ...UserInfo } }
  }
  ${USER_INFO}
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) { createEvent(input: $input) { ...EventSummary } }
  ${EVENT_SUMMARY}
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) { updateEvent(id: $id, input: $input) { ...EventSummary } }
  ${EVENT_SUMMARY}
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) { deleteEvent(id: $id) }
`;

export const JOIN_EVENT = gql`
  mutation JoinEvent($eventId: ID!) { joinEvent(eventId: $eventId) { ...EventSummary } }
  ${EVENT_SUMMARY}
`;

export const LEAVE_EVENT = gql`
  mutation LeaveEvent($eventId: ID!) { leaveEvent(eventId: $eventId) { ...EventSummary } }
  ${EVENT_SUMMARY}
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { ...UserInfo } }
  ${USER_INFO}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) { updateUser(id: $id, input: $input) { ...UserInfo } }
  ${USER_INFO}
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) { deleteUser(id: $id) }
`;
