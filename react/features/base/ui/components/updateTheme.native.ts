/**
 * Custom theme for setting client branding.
 *
 * @param {Object} theme - The ui tokens theme object.
 * @returns {Object}
 */
export default function updateTheme(theme: Object) {
    //Gracetech -- to compact more buttons 
    theme.spacing[2] = 2;
    theme.spacing[3] = 2;
    return theme;
}
