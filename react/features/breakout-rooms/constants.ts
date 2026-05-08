/**
 * Key for this feature.
 */
export const FEATURE_KEY = 'features/breakout-rooms';

/**
 * Feature to rename breakout rooms.
 */
export const BREAKOUT_ROOMS_RENAME_FEATURE = 'rename';

/**
 * Fishmeet: Separator for encoding expiresAt in room name.
 * Uses U+E000 (Private Use Area) character.
 */
export const TIMEOUT_SEPARATOR = '\uE000';

/**
 * Fishmeet: Grace period for safety net timers (milliseconds).
 * Prevents premature room closure due to minor clock skew between clients.
 */
export const SAFETY_GRACE_MS = 5000;

/**
 * Fishmeet: The countdown text turns red when the remaining time is below this threshold (milliseconds).
 */
export const WARNING_THRESHOLD_MS = 60000;

/**
 * Fishmeet: Delay for auto-return to main room after countdown reaches zero (milliseconds).
 */
export const AUTO_RETURN_DELAY_MS = 1500;
