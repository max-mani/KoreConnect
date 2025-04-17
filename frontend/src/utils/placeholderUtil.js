/**
 * Generate an SVG placeholder image data URL
 * 
 * @param {number} width - Width of the placeholder image
 * @param {number} height - Height of the placeholder image
 * @param {string} text - Text to display on the placeholder
 * @param {string} bgColor - Background color
 * @param {string} textColor - Text color
 * @returns {string} Data URL for SVG placeholder image
 */
const getPlaceholderDataUrl = (
  width = 300, 
  height = 200, 
  text = 'No Image', 
  bgColor = '#e0e0e0', 
  textColor = '#666666'
) => {
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
};

/**
 * Get a placeholder image URL with given dimensions and text
 * Used as a drop-in replacement for placeholder.com URLs
 */
const getPlaceholderUrl = (size = '300x200', text = 'No Image') => {
  // Parse size into width and height
  let width = 300;
  let height = 200;
  
  if (size && typeof size === 'string') {
    // Handle various size formats (e.g., "300x200", "150")
    const parts = size.split('x');
    width = parseInt(parts[0], 10) || width;
    height = parseInt(parts[1], 10) || width; // If height not specified, use width
  }
  
  return getPlaceholderDataUrl(width, height, text);
};

/**
 * Handler for image loading errors
 * Sets the src attribute to a placeholder image
 */
const handleImageError = (e, size = '300x200', text = 'No Image') => {
  if (e && e.target) {
    let width = 300;
    let height = 200;
    
    if (size && typeof size === 'string') {
      const parts = size.split('x');
      width = parseInt(parts[0], 10) || width;
      height = parseInt(parts[1], 10) || width;
    }
    
    // Get dimensions from the element if available
    if (e.target.width) width = e.target.width;
    if (e.target.height) height = e.target.height;
    
    e.target.src = getPlaceholderDataUrl(width, height, text);
  }
};

// Common placeholder URLs used throughout the app
const placeholderUrls = {
  menu: getPlaceholderDataUrl(300, 200, 'Menu Item'),
  profile: getPlaceholderDataUrl(150, 150, 'Profile'),
  product: getPlaceholderDataUrl(300, 200, 'Product'),
  thumbnail: getPlaceholderDataUrl(50, 50, 'Thumbnail')
};

export {
  getPlaceholderDataUrl,
  getPlaceholderUrl,
  handleImageError,
  placeholderUrls
}; 