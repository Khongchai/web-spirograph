/**
 * For each rerender, the related field must be provided.
 */
export enum RerenderReason {
  // Navigation
  resize = 1 << 0,
  pan = 1 << 1,
  switchMenu = 1 << 1,
  // Change settings
  speedScale = 1 << 3,
  moveOutsideOfParent = 1 << 4,
  radius = 1 << 5,
  rotationDirection = 1 << 6,
  timeStep = 1 << 7,
  addOrRemoveCycloid = 1 << 8,
  changedFocusedCycloid = 1 << 9,
  rodLength = 1 << 10,
  // Life cycle
  appStart = 1 << 11,
  redraw = 1 << 12,
  // For values that don't need to be dealt with specially.
  undefined = 1 << 13,
}

export const CHANGE_SETTINGS_REASON: number =
  RerenderReason.rodLength |
  RerenderReason.speedScale |
  RerenderReason.moveOutsideOfParent |
  RerenderReason.radius |
  RerenderReason.rotationDirection |
  RerenderReason.addOrRemoveCycloid |
  RerenderReason.timeStep |
  RerenderReason.changedFocusedCycloid |
  RerenderReason.redraw;
