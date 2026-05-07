/**
 * Key for this feature.
 */
export const FEATURE_KEY = 'features/breakout-rooms';

/**
 * Feature to rename breakout rooms.
 */
export const BREAKOUT_ROOMS_RENAME_FEATURE = 'rename';

/**
 * Separator for encoding expiresAt in room name.
 * Uses U+E000 (Private Use Area) character.
 */
export const TIMEOUT_SEPARATOR = '\uE000';

/**
 * Grace period for safety net timers (milliseconds).
 * Prevents premature room closure due to minor clock skew between clients.
 */
export const SAFETY_GRACE_MS = 5000;

/**
 * 剩余时间低于此阈值时倒计时文本变红（毫秒）。
 * D-10, D-11: 60秒警告阈值。
 */
export const WARNING_THRESHOLD_MS = 60000;

/**
 * 倒计时归零后延迟自动返回主房间的等待时间（毫秒）。
 * D-12: 留出显示"讨论时间已到"通知的时间窗口。
 */
export const AUTO_RETURN_DELAY_MS = 1500;
