export namespace CrewActions {
  export enum Update {
    DENY = 'DENY',
    ACCEPT = 'ACCEPT'
  }

  export type UpdateType = Update.ACCEPT | Update.DENY
}

export namespace PubSub {
  export enum Actions {
    USER_ENTERED_TOURNAMENT = 'USER_ENTERED_TOURNAMENT',
    USER_LEFT_TOURNAMENT = 'USER_LEFT_TOURNAMENT'
  }
}