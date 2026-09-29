/**
 * OCR Module - Extracts text from nutrition label images using AI OCR.
 */

/**
 * Extracts text from an image buffer or base64 string.
 * @param {string|Buffer} image - Image data (base64 string or Buffer)
 * @returns {string} Extracted text from the image
 */
export function extractText(image) {
  // In production, this would call an OCR API (e.g., Google Vision, Tesseract)
  // For now, return a placeholder that can be replaced with real OCR
  if (!image || (typeof image === 'string' && image.trim() === '')) {
    return '';
  }
  
  if (typeof image === 'string' && image.startsWith('data:')) {
    // Base64 data URI - extract text (mock)
    return 'Mock OCR text for nutrition label';
  }
  
  if (Buffer.isBuffer(image)) {
    return 'Mock OCR text for nutrition label';
  }
  
  // Assume it's a file path or URL
  return `Mock OCR text for ${image}`;
}