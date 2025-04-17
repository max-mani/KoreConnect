import React from 'react';

/**
 * PlaceholderImage - A component that renders an SVG placeholder image
 * 
 * @param {Object} props
 * @param {number} props.width - Width of the placeholder image
 * @param {number} props.height - Height of the placeholder image
 * @param {string} props.text - Text to display on the placeholder
 * @param {string} props.bgColor - Background color
 * @param {string} props.textColor - Text color
 * @returns {JSX.Element} SVG placeholder image
 */
const PlaceholderImage = ({ 
  width = 300, 
  height = 200, 
  text = 'No Image', 
  bgColor = '#e0e0e0', 
  textColor = '#666666' 
}) => {
  // Create a data URL for the SVG
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
  
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  
  return (
    <img 
      src={dataUrl} 
      alt={text || 'Placeholder image'}
      width={width} 
      height={height}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default PlaceholderImage;

// Usage examples:
// <PlaceholderImage width={300} height={200} text="Product Image" />
// <PlaceholderImage width={150} height={150} text="Profile" bgColor="#f0f0f0" textColor="#333333" /> 