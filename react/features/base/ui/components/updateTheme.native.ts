/**
 * Custom theme for setting client branding.
 *
 * @param {Object} theme - The ui tokens theme object.
 * @returns {Object}
 */
export default function updateTheme(theme: Object) {
    //Gracetech -- to compact more buttons 
    theme.spacing[2] = 4;
    theme.spacing[3] = 4;
    return theme;
}
