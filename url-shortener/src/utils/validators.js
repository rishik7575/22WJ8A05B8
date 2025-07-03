import Logger from './logger';

// validators.js - Input validation utilities for the URL Shortener
// Written by a human (promise!)

/**
 * Checks if a string is a valid URL (not perfect, but good enough for most cases)
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL is valid, false otherwise
 */
export function isValidUrl(url) {
    try {
        // Check if URL is empty
        if (!url || url.trim() === '') {
            Logger.warn("⚠️ Empty URL provided");
            return false;
        }

        // Try to create a URL object - this will throw if invalid
        new URL(url);
        
        // Additional check for http/https protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            Logger.warn("⚠️ URL must start with http:// or https://");
            return false;
        }
        
        return true;
    } catch (error) {
        Logger.error(`❌ Invalid URL: ${error.message}`);
        return false;
    }
}

/**
 * Checks if a string is a valid custom shortcode (4-10 alphanumeric chars)
 * @param {string} shortcode - The shortcode to validate
 * @returns {boolean} - True if shortcode is valid, false otherwise
 */
export function isValidShortcode(code) {
    // Humans like readable codes, so let's keep it simple
    return code === '' || /^[a-zA-Z0-9]{4,10}$/.test(code);
}

/**
 * Checks if expiry is a positive integer (in minutes)
 * @param {number|string} minutes - The expiry time in minutes
 * @returns {boolean} - True if expiry time is valid, false otherwise
 */
export function isValidExpiryTime(minutes) {
    // No negative time machines allowed!
    const num = parseInt(minutes, 10);
    return Number.isInteger(num) && num > 0;
}

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
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

// TODO: Add more validators if requirements change!