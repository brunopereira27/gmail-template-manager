const BASE_PIXEL = 16;

/**
 * Convert pixel number to rem property value.
 * Computed rem value is corresponding to the given pixel
 * height, if the user browser is set up with a 16px base font
 * and a 100% zoom (most of the cases).
 * If browser settings is set differently, rem size
 * would scale to fit browser display.
 *
 * @param px: The targeted pixel height.
 * @return css property with related rem size : 16px would return "1rem".
 */
export const pxToRem = px => px / BASE_PIXEL + "rem";
