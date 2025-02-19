/**
 * The types of the buttons.
 */
export enum BUTTON_TYPES {
    DESTRUCTIVE = 'destructive',
    FISHMEET_PRIMARY = 'fishmeet_primary',
    FISHMEET_SECONDARY = 'fishmeet_secondary',
    FISHMEET_TERTIARY = 'fishmeet_tertiary',
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    TERTIARY = 'tertiary'
}

export enum WEB_BUTTON_TYPES {
    DESTRUCTIVE = 'destructive',
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    TERTIARY = 'tertiary'
}

/**
 * Behaviour types for showing overflow text content.
 */
export enum TEXT_OVERFLOW_TYPES {
    ELLIPSIS = 'ellipsis',
    SCROLL_ON_HOVER = 'scroll-on-hover'
}

/**
 * The modes of the buttons.
 */
export const BUTTON_MODES: {
    CONTAINED: 'contained';
    TEXT: 'text';
} = {
    CONTAINED: 'contained',
    TEXT: 'text'
};


export type TOOLTIP_POSITION = 'top' | 'bottom' | 'left' | 'right';

type ButtonStyles = Record<
    'button' | 'primary' | 'secondary' |
    'tertiary' | 'destructive' | 'disabled'
    | 'iconButton' | 'textWithIcon' | 'small'
    | 'large' | 'fullWidth' | 'fishmeet_primary'
    | 'fishmeet_secondary' | 'fishmeet_tertiary',
    string
>;

export { ButtonStyles };
