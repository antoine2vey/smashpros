export * from './isAdmin'
export * from './isAuthenticated'
export * from './isNotCrewAdmin'
export * from './isTO'

export function authorizations(...functions) {
  return (...args) => {
    return functions.every((fn) => fn(...args))
  }
}
