/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type { Context } from './../src/context'
import type { core, connectionPluginCore } from 'nexus'
import type { FieldAuthorizeResolver } from 'nexus/dist/plugins/fieldAuthorizePlugin'
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(
      fieldName: FieldName,
      opts?: core.CommonInputFieldConfig<TypeName, FieldName>
    ): void // "JSON";
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(
      fieldName: FieldName,
      opts?: core.CommonInputFieldConfig<TypeName, FieldName>
    ): void // "Upload";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(
      fieldName: FieldName,
      ...opts: core.ScalarOutSpread<TypeName, FieldName>
    ): void // "JSON";
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(
      fieldName: FieldName,
      ...opts: core.ScalarOutSpread<TypeName, FieldName>
    ): void // "Upload";
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>
    ): void
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CrewCreationPayload: {
    // input type
    banner: NexusGenScalars['Upload'] // Upload!
    icon: NexusGenScalars['Upload'] // Upload!
    name: string // String!
    prefix: string // String!
  }
  RegisterPayload: {
    // input type
    success?: boolean | null // Boolean
  }
  TournamentQuery: {
    // input type
    id?: string | null // ID
    player?: string | null // String
  }
  UserFilter: {
    // input type
    characters?: string[] | null // [ID!]
    tag?: string | null // String
    tournament?: string | null // ID
  }
  UserRegisterPayload: {
    // input type
    characters: string[] // [ID!]!
    email: string // String!
    password: string // String!
    profilePicture: NexusGenScalars['Upload'] // Upload!
    smashGGPlayerId?: number | null // Int
    smashGGSlug?: string | null // String
    smashGGUserId?: number | null // Int
    tag: string // String!
    twitchUsername?: string | null // String
    twitterUsername?: string | null // String
  }
  UserUpdatePayload: {
    // input type
    characters: string[] // [ID!]!
    email: string // String!
    password: string // String!
    profilePicture?: NexusGenScalars['Upload'] | null // Upload
    smashGGPlayerId?: number | null // Int
    smashGGSlug?: string | null // String
    smashGGUserId?: number | null // Int
    tag: string // String!
    twitchUsername?: string | null // String
    twitterUsername?: string | null // String
  }
}

export interface NexusGenEnums {
  CrewUpdateActionEnum: 'ACCEPT' | 'DENY'
  MatchState: 'CHARACTER_CHOICE' | 'FINISHED' | 'HOLD' | 'PLAYING' | 'REFUSED'
  RoleEnum: 'ADMIN' | 'CREW_ADMIN' | 'TOURNAMENT_ORGANIZER' | 'USER'
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
  JSON: any
  Upload: any
}

export interface NexusGenObjects {
  AuthPayload: {
    // root type
    accessToken?: string | null // String
    refreshToken?: string | null // String
  }
  Battle: {
    // root type
    id: string // ID!
  }
  Character: {
    // root type
    id: string // ID!
    name: string // String!
    picture: string // String!
  }
  Crew: {
    // root type
    banner: string // String!
    icon: string // String!
    id: string // ID!
    name: string // String!
    prefix: string // String!
  }
  Event: {
    // root type
    event_id: number // Int!
    id: string // ID!
    name: string // String!
    num_attendees: number // Int!
    tier: string // String!
    valid: boolean // Boolean!
  }
  Match: {
    // root type
    amount?: number | null // Int
    id: string // ID!
    initiator_wins: number // Int!
    is_moneymatch: boolean // Boolean!
    opponent_wins: number // Int!
    state: NexusGenEnums['MatchState'] // MatchState!
    total_matches: number // Int!
  }
  MatchConnection: {
    // root type
    edges?: Array<NexusGenRootTypes['MatchEdge'] | null> | null // [MatchEdge]
    pageInfo: NexusGenRootTypes['PageInfo'] // PageInfo!
  }
  MatchEdge: {
    // root type
    cursor: string // String!
    node?: NexusGenRootTypes['Match'] | null // Match
  }
  Mutation: {}
  PageInfo: {
    // root type
    endCursor?: string | null // String
    hasNextPage: boolean // Boolean!
    hasPreviousPage: boolean // Boolean!
    startCursor?: string | null // String
  }
  Query: {}
  RefreshPayload: {
    // root type
    accessToken?: string | null // String
  }
  Role: {
    // root type
    id: string // ID!
    name: NexusGenEnums['RoleEnum'] // RoleEnum!
  }
  Subscription: {}
  SuggestedName: {
    // root type
    profilePicture?: string | null // String
    smashGGPlayerId: number // Int!
    smashGGUserId: number // Int!
    tag: string // String!
  }
  Tournament: {
    // root type
    city?: string | null // String
    country_code: string // String!
    created_at?: NexusGenScalars['DateTime'] | null // DateTime
    currency: string // String!
    end_at?: NexusGenScalars['DateTime'] | null // DateTime
    event_registration_closes_at?: NexusGenScalars['DateTime'] | null // DateTime
    has_offline_events?: boolean | null // Boolean
    id: string // ID!
    images: string[] // [String!]!
    is_registration_open?: boolean | null // Boolean
    is_started: boolean // Boolean!
    lat?: number | null // Float
    lng?: number | null // Float
    name: string // String!
    num_attendees?: number | null // Int
    slug: string // String!
    start_at?: NexusGenScalars['DateTime'] | null // DateTime
    state: number // Int!
    tournament_id: number // Int!
    venue_address?: string | null // String
    venue_name?: string | null // String
  }
  TournamentConnection: {
    // root type
    edges?: Array<NexusGenRootTypes['TournamentEdge'] | null> | null // [TournamentEdge]
    pageInfo: NexusGenRootTypes['PageInfo'] // PageInfo!
  }
  TournamentEdge: {
    // root type
    cursor: string // String!
    node?: NexusGenRootTypes['Tournament'] | null // Tournament
  }
  TournamentParticipants_Connection: {
    // root type
    edges?: Array<NexusGenRootTypes['UserEdge'] | null> | null // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo'] // PageInfo!
  }
  User: {
    // root type
    allow_notifications: boolean // Boolean!
    allow_searchability: boolean // Boolean!
    created_at: NexusGenScalars['DateTime'] // DateTime!
    email: string // String!
    id: string // ID!
    in_match: boolean // Boolean!
    in_tournament: boolean // Boolean!
    profile_picture?: string | null // String
    smashgg_player_id?: number | null // Int
    smashgg_slug?: string | null // String
    tag: string // String!
    twitch_username?: string | null // String
    twitter_username?: string | null // String
    updated_at: NexusGenScalars['DateTime'] // DateTime!
  }
  UserConnection: {
    // root type
    edges?: Array<NexusGenRootTypes['UserEdge'] | null> | null // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo'] // PageInfo!
  }
  UserEdge: {
    // root type
    cursor: string // String!
    node?: NexusGenRootTypes['User'] | null // User
  }
}

export interface NexusGenInterfaces {}

export interface NexusGenUnions {}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes &
  NexusGenScalars &
  NexusGenEnums

export interface NexusGenFieldTypes {
  AuthPayload: {
    // field return type
    accessToken: string | null // String
    refreshToken: string | null // String
  }
  Battle: {
    // field return type
    id: string // ID!
    initiator: NexusGenRootTypes['User'] | null // User
    initiator_character: NexusGenRootTypes['Character'] | null // Character
    initiator_vote: NexusGenRootTypes['User'] | null // User
    opponent: NexusGenRootTypes['User'] | null // User
    opponent_character: NexusGenRootTypes['Character'] | null // Character
    opponent_vote: NexusGenRootTypes['User'] | null // User
    winner: NexusGenRootTypes['User'] | null // User
  }
  Character: {
    // field return type
    id: string // ID!
    name: string // String!
    picture: string // String!
    users: NexusGenRootTypes['User'][] // [User!]!
  }
  Crew: {
    // field return type
    admin: NexusGenRootTypes['User'] // User!
    banner: string // String!
    icon: string // String!
    id: string // ID!
    members: NexusGenRootTypes['User'][] // [User!]!
    name: string // String!
    prefix: string // String!
    waiting_members: NexusGenRootTypes['User'][] // [User!]!
  }
  Event: {
    // field return type
    event_id: number // Int!
    id: string // ID!
    name: string // String!
    num_attendees: number // Int!
    tier: string // String!
    tournament: NexusGenRootTypes['Tournament'] // Tournament!
    valid: boolean // Boolean!
  }
  Match: {
    // field return type
    amount: number | null // Int
    battles: NexusGenRootTypes['Battle'][] // [Battle!]!
    id: string // ID!
    initiator: NexusGenRootTypes['User'] | null // User
    initiator_wins: number // Int!
    is_moneymatch: boolean // Boolean!
    opponent: NexusGenRootTypes['User'] | null // User
    opponent_wins: number // Int!
    state: NexusGenEnums['MatchState'] // MatchState!
    total_matches: number // Int!
    winner: NexusGenRootTypes['User'] | null // User
  }
  MatchConnection: {
    // field return type
    edges: Array<NexusGenRootTypes['MatchEdge'] | null> | null // [MatchEdge]
    pageInfo: NexusGenRootTypes['PageInfo'] // PageInfo!
  }
  MatchEdge: {
    // field return type
    cursor: string // String!
    node: NexusGenRootTypes['Match'] | null // Match
  }
  Mutation: {
    // field return type
    askPasswordReset: string | null // String
    checkUserIn: boolean | null // Boolean
    createCrew: NexusGenRootTypes['Crew'] | null // Crew
    favoriteTournament: boolean | null // Boolean
    joinCrew: NexusGenRootTypes['Crew'] | null // Crew
    kickMember: NexusGenRootTypes['User'] | null // User
    leaveCrew: NexusGenRootTypes['Crew'] | null // Crew
    login: NexusGenRootTypes['AuthPayload'] | null // AuthPayload
    participateTournament: NexusGenRootTypes['Tournament'] | null // Tournament
    passwordReset: boolean | null // Boolean
    refresh: NexusGenRootTypes['RefreshPayload'] | null // RefreshPayload
    register: NexusGenRootTypes['User'] | null // User
    sendMatchInvite: NexusGenRootTypes['Match'] | null // Match
    setOnline: NexusGenRootTypes['User'] | null // User
    synchronizeTournaments: Array<NexusGenRootTypes['Tournament'] | null> | null // [Tournament]
    transferCrewOwnership: NexusGenRootTypes['Crew'] | null // Crew
    updateBattle: NexusGenRootTypes['Battle'] | null // Battle
    updateMatch: NexusGenRootTypes['Match'] | null // Match
    updateMember: NexusGenRootTypes['Crew'] | null // Crew
    updateProfile: NexusGenRootTypes['User'] | null // User
    userEnteredTournament: NexusGenRootTypes['User'] | null // User
    userLeftTournament: NexusGenRootTypes['User'] | null // User
  }
  PageInfo: {
    // field return type
    endCursor: string | null // String
    hasNextPage: boolean // Boolean!
    hasPreviousPage: boolean // Boolean!
    startCursor: string | null // String
  }
  Query: {
    // field return type
    characters: Array<NexusGenRootTypes['Character'] | null> | null // [Character]
    crew: NexusGenRootTypes['Crew'] | null // Crew
    crews: Array<NexusGenRootTypes['Crew'] | null> | null // [Crew]
    match: NexusGenRootTypes['Match'] | null // Match
    matches: NexusGenRootTypes['MatchConnection'] | null // MatchConnection
    suggestedName: NexusGenRootTypes['SuggestedName'] | null // SuggestedName
    tournament: NexusGenRootTypes['Tournament'] | null // Tournament
    tournaments: NexusGenRootTypes['TournamentConnection'] | null // TournamentConnection
    user: NexusGenRootTypes['User'] | null // User
    users: NexusGenRootTypes['UserConnection'] | null // UserConnection
  }
  RefreshPayload: {
    // field return type
    accessToken: string | null // String
  }
  Role: {
    // field return type
    id: string // ID!
    name: NexusGenEnums['RoleEnum'] // RoleEnum!
  }
  Subscription: {
    // field return type
    onBattleUpdate: NexusGenRootTypes['Battle'] | null // Battle
    onMatchUpdate: NexusGenRootTypes['Match'] | null // Match
    onUserJoinMatch: NexusGenRootTypes['User'] | null // User
    onUserLeftMatch: NexusGenRootTypes['User'] | null // User
    userEnteredTournament: NexusGenRootTypes['User'] // User!
    userLeftTournament: NexusGenRootTypes['User'] // User!
  }
  SuggestedName: {
    // field return type
    profilePicture: string | null // String
    smashGGPlayerId: number // Int!
    smashGGUserId: number // Int!
    tag: string // String!
  }
  Tournament: {
    // field return type
    city: string | null // String
    country_code: string // String!
    created_at: NexusGenScalars['DateTime'] | null // DateTime
    currency: string // String!
    end_at: NexusGenScalars['DateTime'] | null // DateTime
    event_registration_closes_at: NexusGenScalars['DateTime'] | null // DateTime
    events: NexusGenRootTypes['Event'][] // [Event!]!
    favorited_by: NexusGenRootTypes['User'][] // [User!]!
    has_offline_events: boolean | null // Boolean
    id: string // ID!
    images: string[] // [String!]!
    is_registration_open: boolean | null // Boolean
    is_started: boolean // Boolean!
    lat: number | null // Float
    lng: number | null // Float
    name: string // String!
    num_attendees: number | null // Int
    participants: NexusGenRootTypes['TournamentParticipants_Connection'] | null // TournamentParticipants_Connection
    slug: string // String!
    start_at: NexusGenScalars['DateTime'] | null // DateTime
    state: number // Int!
    tournament_id: number // Int!
    venue_address: string | null // String
    venue_name: string | null // String
  }
  TournamentConnection: {
    // field return type
    edges: Array<NexusGenRootTypes['TournamentEdge'] | null> | null // [TournamentEdge]
    pageInfo: NexusGenRootTypes['PageInfo'] // PageInfo!
  }
  TournamentEdge: {
    // field return type
    cursor: string // String!
    node: NexusGenRootTypes['Tournament'] | null // Tournament
  }
  TournamentParticipants_Connection: {
    // field return type
    edges: Array<NexusGenRootTypes['UserEdge'] | null> | null // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo'] // PageInfo!
    totalCount: number | null // Int
  }
  User: {
    // field return type
    allow_notifications: boolean // Boolean!
    allow_searchability: boolean // Boolean!
    characters: NexusGenRootTypes['Character'][] // [Character!]!
    created_at: NexusGenScalars['DateTime'] // DateTime!
    crew: NexusGenRootTypes['Crew'] | null // Crew
    email: string // String!
    favorited_tournaments: NexusGenRootTypes['Tournament'][] // [Tournament!]!
    id: string // ID!
    in_match: boolean // Boolean!
    in_tournament: boolean // Boolean!
    nextTournament: NexusGenRootTypes['Tournament'] | null // Tournament
    profile_picture: string | null // String
    roles: NexusGenRootTypes['Role'][] // [Role!]!
    smashgg_player_id: number | null // Int
    smashgg_slug: string | null // String
    tag: string // String!
    tournaments: NexusGenRootTypes['Tournament'][] // [Tournament!]!
    tournaments_organizer: NexusGenRootTypes['Tournament'][] // [Tournament!]!
    twitch_username: string | null // String
    twitter_username: string | null // String
    updated_at: NexusGenScalars['DateTime'] // DateTime!
    waiting_crew: NexusGenRootTypes['Crew'] | null // Crew
  }
  UserConnection: {
    // field return type
    edges: Array<NexusGenRootTypes['UserEdge'] | null> | null // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo'] // PageInfo!
  }
  UserEdge: {
    // field return type
    cursor: string // String!
    node: NexusGenRootTypes['User'] | null // User
  }
}

export interface NexusGenFieldTypeNames {
  AuthPayload: {
    // field return type name
    accessToken: 'String'
    refreshToken: 'String'
  }
  Battle: {
    // field return type name
    id: 'ID'
    initiator: 'User'
    initiator_character: 'Character'
    initiator_vote: 'User'
    opponent: 'User'
    opponent_character: 'Character'
    opponent_vote: 'User'
    winner: 'User'
  }
  Character: {
    // field return type name
    id: 'ID'
    name: 'String'
    picture: 'String'
    users: 'User'
  }
  Crew: {
    // field return type name
    admin: 'User'
    banner: 'String'
    icon: 'String'
    id: 'ID'
    members: 'User'
    name: 'String'
    prefix: 'String'
    waiting_members: 'User'
  }
  Event: {
    // field return type name
    event_id: 'Int'
    id: 'ID'
    name: 'String'
    num_attendees: 'Int'
    tier: 'String'
    tournament: 'Tournament'
    valid: 'Boolean'
  }
  Match: {
    // field return type name
    amount: 'Int'
    battles: 'Battle'
    id: 'ID'
    initiator: 'User'
    initiator_wins: 'Int'
    is_moneymatch: 'Boolean'
    opponent: 'User'
    opponent_wins: 'Int'
    state: 'MatchState'
    total_matches: 'Int'
    winner: 'User'
  }
  MatchConnection: {
    // field return type name
    edges: 'MatchEdge'
    pageInfo: 'PageInfo'
  }
  MatchEdge: {
    // field return type name
    cursor: 'String'
    node: 'Match'
  }
  Mutation: {
    // field return type name
    askPasswordReset: 'String'
    checkUserIn: 'Boolean'
    createCrew: 'Crew'
    favoriteTournament: 'Boolean'
    joinCrew: 'Crew'
    kickMember: 'User'
    leaveCrew: 'Crew'
    login: 'AuthPayload'
    participateTournament: 'Tournament'
    passwordReset: 'Boolean'
    refresh: 'RefreshPayload'
    register: 'User'
    sendMatchInvite: 'Match'
    setOnline: 'User'
    synchronizeTournaments: 'Tournament'
    transferCrewOwnership: 'Crew'
    updateBattle: 'Battle'
    updateMatch: 'Match'
    updateMember: 'Crew'
    updateProfile: 'User'
    userEnteredTournament: 'User'
    userLeftTournament: 'User'
  }
  PageInfo: {
    // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Query: {
    // field return type name
    characters: 'Character'
    crew: 'Crew'
    crews: 'Crew'
    match: 'Match'
    matches: 'MatchConnection'
    suggestedName: 'SuggestedName'
    tournament: 'Tournament'
    tournaments: 'TournamentConnection'
    user: 'User'
    users: 'UserConnection'
  }
  RefreshPayload: {
    // field return type name
    accessToken: 'String'
  }
  Role: {
    // field return type name
    id: 'ID'
    name: 'RoleEnum'
  }
  Subscription: {
    // field return type name
    onBattleUpdate: 'Battle'
    onMatchUpdate: 'Match'
    onUserJoinMatch: 'User'
    onUserLeftMatch: 'User'
    userEnteredTournament: 'User'
    userLeftTournament: 'User'
  }
  SuggestedName: {
    // field return type name
    profilePicture: 'String'
    smashGGPlayerId: 'Int'
    smashGGUserId: 'Int'
    tag: 'String'
  }
  Tournament: {
    // field return type name
    city: 'String'
    country_code: 'String'
    created_at: 'DateTime'
    currency: 'String'
    end_at: 'DateTime'
    event_registration_closes_at: 'DateTime'
    events: 'Event'
    favorited_by: 'User'
    has_offline_events: 'Boolean'
    id: 'ID'
    images: 'String'
    is_registration_open: 'Boolean'
    is_started: 'Boolean'
    lat: 'Float'
    lng: 'Float'
    name: 'String'
    num_attendees: 'Int'
    participants: 'TournamentParticipants_Connection'
    slug: 'String'
    start_at: 'DateTime'
    state: 'Int'
    tournament_id: 'Int'
    venue_address: 'String'
    venue_name: 'String'
  }
  TournamentConnection: {
    // field return type name
    edges: 'TournamentEdge'
    pageInfo: 'PageInfo'
  }
  TournamentEdge: {
    // field return type name
    cursor: 'String'
    node: 'Tournament'
  }
  TournamentParticipants_Connection: {
    // field return type name
    edges: 'UserEdge'
    pageInfo: 'PageInfo'
    totalCount: 'Int'
  }
  User: {
    // field return type name
    allow_notifications: 'Boolean'
    allow_searchability: 'Boolean'
    characters: 'Character'
    created_at: 'DateTime'
    crew: 'Crew'
    email: 'String'
    favorited_tournaments: 'Tournament'
    id: 'ID'
    in_match: 'Boolean'
    in_tournament: 'Boolean'
    nextTournament: 'Tournament'
    profile_picture: 'String'
    roles: 'Role'
    smashgg_player_id: 'Int'
    smashgg_slug: 'String'
    tag: 'String'
    tournaments: 'Tournament'
    tournaments_organizer: 'Tournament'
    twitch_username: 'String'
    twitter_username: 'String'
    updated_at: 'DateTime'
    waiting_crew: 'Crew'
  }
  UserConnection: {
    // field return type name
    edges: 'UserEdge'
    pageInfo: 'PageInfo'
  }
  UserEdge: {
    // field return type name
    cursor: 'String'
    node: 'User'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    askPasswordReset: {
      // args
      email: string // String!
    }
    checkUserIn: {
      // args
      participant: string // ID!
      tournament: string // ID!
    }
    createCrew: {
      // args
      payload: NexusGenInputs['CrewCreationPayload'] // CrewCreationPayload!
    }
    favoriteTournament: {
      // args
      id: string // ID!
      unfavorite?: boolean | null // Boolean
    }
    joinCrew: {
      // args
      id: string // ID!
    }
    kickMember: {
      // args
      id: string // ID!
    }
    login: {
      // args
      email: string // String!
      password: string // String!
    }
    participateTournament: {
      // args
      id: string // ID!
      unparticipate?: boolean | null // Boolean
    }
    passwordReset: {
      // args
      code: string // String!
      confirmPassword: string // String!
      password: string // String!
    }
    refresh: {
      // args
      refreshToken: string // String!
    }
    register: {
      // args
      payload: NexusGenInputs['UserRegisterPayload'] // UserRegisterPayload!
    }
    sendMatchInvite: {
      // args
      amount?: number | null // Int
      isMoneymatch?: boolean | null // Boolean
      to: string // ID!
      totalMatches: number // Int!
      tournament?: string | null // ID
    }
    setOnline: {
      // args
      online: boolean // Boolean!
    }
    transferCrewOwnership: {
      // args
      to: string // ID!
    }
    updateBattle: {
      // args
      character?: string | null // ID
      id: string // ID!
      vote?: string | null // ID
    }
    updateMatch: {
      // args
      id: string // ID!
      state: NexusGenEnums['MatchState'] // MatchState!
    }
    updateMember: {
      // args
      action: NexusGenEnums['CrewUpdateActionEnum'] // CrewUpdateActionEnum!
      id: string // ID!
    }
    updateProfile: {
      // args
      payload: NexusGenInputs['UserUpdatePayload'] // UserUpdatePayload!
    }
    userEnteredTournament: {
      // args
      tournament: string // ID!
    }
    userLeftTournament: {
      // args
      tournament: string // ID!
    }
  }
  Query: {
    crew: {
      // args
      id?: string | null // ID
    }
    match: {
      // args
      id: string // ID!
    }
    matches: {
      // args
      after?: string | null // String
      before?: string | null // String
      first?: number | null // Int
      last?: number | null // Int
    }
    suggestedName: {
      // args
      slug: string // String!
    }
    tournament: {
      // args
      id: string // ID!
    }
    tournaments: {
      // args
      after?: string | null // String
      before?: string | null // String
      first?: number | null // Int
      last?: number | null // Int
    }
    user: {
      // args
      id?: string | null // ID
    }
    users: {
      // args
      after?: string | null // String
      before?: string | null // String
      filters: NexusGenInputs['UserFilter'] // UserFilter!
      first?: number | null // Int
      last?: number | null // Int
    }
  }
  Subscription: {
    onBattleUpdate: {
      // args
      id?: string | null // ID
    }
    onMatchUpdate: {
      // args
      id: string // ID!
    }
    onUserJoinMatch: {
      // args
      id: string // ID!
    }
    onUserLeftMatch: {
      // args
      id: string // ID!
    }
  }
  Tournament: {
    participants: {
      // args
      after?: string | null // String
      before?: string | null // String
      characters?: string[] | null // [ID!]
      first?: number | null // Int
      last?: number | null // Int
    }
  }
}

export interface NexusGenAbstractTypeMembers {}

export interface NexusGenTypeInterfaces {}

export type NexusGenObjectNames = keyof NexusGenObjects

export type NexusGenInputNames = keyof NexusGenInputs

export type NexusGenEnumNames = keyof NexusGenEnums

export type NexusGenInterfaceNames = never

export type NexusGenScalarNames = keyof NexusGenScalars

export type NexusGenUnionNames = never

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never

export type NexusGenAbstractsUsingStrategyResolveType = never

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context
  inputTypes: NexusGenInputs
  rootTypes: NexusGenRootTypes
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars
  argTypes: NexusGenArgTypes
  fieldTypes: NexusGenFieldTypes
  fieldTypeNames: NexusGenFieldTypeNames
  allTypes: NexusGenAllTypes
  typeInterfaces: NexusGenTypeInterfaces
  objectNames: NexusGenObjectNames
  inputNames: NexusGenInputNames
  enumNames: NexusGenEnumNames
  interfaceNames: NexusGenInterfaceNames
  scalarNames: NexusGenScalarNames
  unionNames: NexusGenUnionNames
  allInputTypes:
    | NexusGenTypes['inputNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['scalarNames']
  allOutputTypes:
    | NexusGenTypes['objectNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['unionNames']
    | NexusGenTypes['interfaceNames']
    | NexusGenTypes['scalarNames']
  allNamedTypes:
    | NexusGenTypes['allInputTypes']
    | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames']
  abstractTypeMembers: NexusGenAbstractTypeMembers
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType
  features: NexusGenFeaturesConfig
}

declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<
    TypeName extends string,
    FieldName extends string
  > {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<
    TypeName extends string,
    FieldName extends string
  > {}
  interface NexusGenPluginSchemaConfig {}
  interface NexusGenPluginArgConfig {}
}
