import Logger from './logger';

/**
 * Validates a URL string
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL is valid, false otherwise
 */
export const isValidUrl = (url) => {
    try {
        // Check if URL is empty
        if (!url || url.trim() === '') {
            Logger.warn("Empty URL provided");
            return false;
        }

        // Try to create a URL object - this will throw if invalid
        new URL(url);
        
        // Additional check for http/https protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            Logger.warn("URL must start with http:// or https://");
            return false;
        }
        
        return true;
    } catch (error) {
        Logger.error(`Invalid URL: ${error.message}`);
        return false;
    }
};

/**
 * Validates a shortcode
 * @param {string} shortcode - The shortcode to validate
 * @returns {boolean} - True if shortcode is valid, false otherwise
 */
export const isValidShortcode = (shortcode) => {
    // Shortcode should be alphanumeric and between 4-10 characters
    const shortcodeRegex = /^[a-zA-Z0-9]{4,10}$/;
    
    if (!shortcode) {
        return true; // Empty shortcode is valid (will be auto-generated)
    }
    
    const isValid = shortcodeRegex.test(shortcode);
    
    if (!isValid) {
        Logger.warn("Invalid shortcode format. Must be 4-10 alphanumeric characters.");
    }
    
    return isValid;
};

/**
 * Validates expiry time in minutes
 * @param {number} minutes - The expiry time in minutes
 * @returns {boolean} - True if expiry time is valid, false otherwise
 */
export const isValidExpiryTime = (minutes) => {
    // If no expiry time is provided, it's valid (will use default)
    if (minutes === undefined || minutes === null || minutes === '') {
        return true;
    }
    
    // Convert to number if it's a string
    const numMinutes = Number(minutes);
    
    // Check if it's a valid number and greater than 0
    if (isNaN(numMinutes) || numMinutes <= 0) {
        Logger.warn("Invalid expiry time. Must be a positive number.");
        return false;
    }
    
    return true;
};

/**
 * Generates a random shortcode
 * @returns {string} - A random 6-character alphanumeric shortcode
 */
export const generateShortcode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
};

/**
 * Formats a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleString();
};