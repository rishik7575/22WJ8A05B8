import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Logger from '../utils/logger';

// RedirectHandler.jsx - Handles redirecting short URLs
// This file is the traffic cop for your links.
// Written by a human (with coffee)
// TODO: Handle 404s more gracefully!

const RedirectHandler = () => {
    const { shortcode } = useParams();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const findAndRedirect = () => {
            try {
                // Get URLs from localStorage
                const urls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
                
                // Find the URL with matching shortcode
                const urlData = urls.find(url => url.shortcode === shortcode);
                
                if (!urlData) {
                    setError('😕 Short URL not found. Double-check your link!');
                    setLoading(false);
                    Logger.error(`Redirect failed: Short URL with code ${shortcode} not found`);
                    return;
                }
                
                // Check if URL is expired
                if (new Date() > new Date(urlData.expiresAt)) {
                    setError('⏰ This short URL has expired. Time to make a new one!');
                    setLoading(false);
                    Logger.warn(`Redirect failed: Short URL with code ${shortcode} has expired`);
                    return;
                }
                
                // Record click details
                const clickDetails = {
                    timestamp: new Date(),
                    ipAddress: '127.0.0.1', // In a real app, this would be the actual IP
                    referrer: document.referrer || null,
                    userAgent: navigator.userAgent
                };
                
                // Update click count and details
                const updatedUrls = urls.map(url => {
                    if (url.shortcode === shortcode) {
                        return {
                            ...url,
                            clicks: url.clicks + 1,
                            clickDetails: [...url.clickDetails, clickDetails]
                        };
                    }
                    return url;
                });
                
                // Save updated data
                localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
                
                // Set destination for redirect
                setDestination(urlData.originalUrl);
                Logger.info(`Redirecting to ${urlData.originalUrl} from shortcode ${shortcode}`);
            } catch (error) {
                setError('💥 An error occurred while processing the redirect. Try again later!');
                Logger.error(`Redirect error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        
        // Short delay to show loading state
        const timer = setTimeout(findAndRedirect, 1000);
        
        return () => clearTimeout(timer);
    }, [shortcode]);
    
    if (loading) {
        return (
            <Container maxWidth="sm">
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    minHeight="100vh"
                >
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Redirecting you to your destination...
                    </Typography>
                </Box>
            </Container>
        );
    }
    
    if (error) {
        return (
            <Container maxWidth="sm">
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    minHeight="100vh"
                >
                    <Typography variant="h4" color="error" gutterBottom>
                        Redirect Failed
                    </Typography>
                    <Typography variant="body1">
                        {error}
                    </Typography>
                </Box>
            </Container>
        );
    }
    
    // Redirect to destination URL
    return <Navigate to={destination} replace />;
};

export default RedirectHandler;