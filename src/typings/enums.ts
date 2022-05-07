export namespace CrewActions {
  export enum Update {
    DENY = 'DENY',
    ACCEPT = 'ACCEPT'
  }

  export type UpdateType = Update.ACCEPT | Update.DENY
}

export namespace PubSub {
  export enum Actions {
    // Tournaments
    USER_ENTERED_TOURNAMENT = 'USER_ENTERED_TOURNAMENT',
    USER_LEFT_TOURNAMENT = 'USER_LEFT_TOURNAMENT',

    // Match
    MATCH_JOIN = 'MATCH_JOIN',
    MATCH_LEFT = 'MATCH_LEFT',
    MATCH_UPDATE_STATE = 'MATCH_UPDATE_STATE',
    BATTLE_UPDATE_STATE = 'BATTLE_UPDATE_STATE',
    // In case I implement stage ban/pick later on
    MATCH_STAGE_PICK = 'MATCH_STAGE_PICK',
    MATCH_STAGE_BAN = 'MATCH_STAGE_BAN'
  }
}
