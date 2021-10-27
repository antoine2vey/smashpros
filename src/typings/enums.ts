export enum CrewUpdateAction {
  DENY = 'DENY',
  ACCEPT = 'ACCEPT'
}

export type CrewUpdateValue = CrewUpdateAction.ACCEPT | CrewUpdateAction.DENY

export enum PubSubActions {
  USER_ENTERED_TOURNAMENT = 'USER_ENTERED_TOURNAMENT'
}