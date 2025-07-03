import React, { useState } from 'react';
import { 
    Container, Typography, TextField, Button, Box, 
    Paper, Grid, Snackbar, Alert, IconButton, Divider,
    List, ListItem, ListItemText, Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { isValidUrl, isValidShortcode, isValidExpiryTime, generateShortcode, formatDate } from '../utils/validators';
import Logger from '../utils/logger';

// UrlShortenerPage.jsx - Main page for shortening URLs
// This page lets you shrink your links and feel like a wizard.
// Written by a human (with a little help from the internet)
// TODO: Add dark mode support!

const UrlShortenerPage = () => {
    // State for URL inputs (up to 5)
    const [urlInputs, setUrlInputs] = useState([
        { longUrl: '', shortcode: '', expiryMinutes: '30' }
    ]);
    
    // State for shortened URLs
    const [shortenedUrls, setShortenedUrls] = useState([]);
    
    // State for alerts
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    
    // Add a new URL input field (max 5)
    const addUrlInput = () => {
        if (urlInputs.length < 5) {
            setUrlInputs([...urlInputs, { longUrl: '', shortcode: '', expiryMinutes: '30' }]);
            Logger.info('🆕 Added new URL input field');
        } else {
            setAlert({
                open: true,
                message: '🚫 Maximum 5 URLs allowed at once',
                severity: 'warning'
            });
            Logger.warn('Attempted to add more than 5 URL inputs');
        }
    };
    
    // Remove a URL input field
    const removeUrlInput = (index) => {
        const newInputs = [...urlInputs];
        newInputs.splice(index, 1);
        setUrlInputs(newInputs);
        Logger.info(`🗑️ Removed URL input field at index ${index}`);
    };
    
    // Handle input changes
    const handleInputChange = (index, field, value) => {
        const newInputs = [...urlInputs];
        newInputs[index][field] = value;
        setUrlInputs(newInputs);
    };
    
    // Validate all inputs
    const validateInputs = () => {
        for (let i = 0; i < urlInputs.length; i++) {
            const { longUrl, shortcode, expiryMinutes } = urlInputs[i];
            
            if (!isValidUrl(longUrl)) {
                setAlert({
                    open: true,
                    message: `❌ URL #${i+1} is invalid`,
                    severity: 'error'
                });
                return false;
            }
            
            if (!isValidShortcode(shortcode)) {
                setAlert({
                    open: true,
                    message: `❌ Shortcode for URL #${i+1} is invalid (must be 4-10 alphanumeric characters)`,
                    severity: 'error'
                });
                return false;
            }
            
            if (!isValidExpiryTime(expiryMinutes)) {
                setAlert({
                    open: true,
                    message: `❌ Expiry time for URL #${i+1} is invalid`,
                    severity: 'error'
                });
                return false;
            }
        }
        
        // Check for duplicate shortcodes
        const shortcodes = urlInputs
            .map(input => input.shortcode)
            .filter(code => code !== '');
            
        if (new Set(shortcodes).size !== shortcodes.length) {
            setAlert({
                open: true,
                message: '❌ Duplicate shortcodes detected',
                severity: 'error'
            });
            Logger.error('Duplicate shortcodes detected in form submission');
            return false;
        }
        
        return true;
    };
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateInputs()) {
            return;
        }
        
        Logger.info('📝 URL shortening form submitted');
        
        // Process each URL
        const newShortenedUrls = urlInputs.map(input => {
            const { longUrl, shortcode, expiryMinutes } = input;
            
            // Generate shortcode if not provided
            const finalShortcode = shortcode || generateShortcode();
            
            // Calculate expiry time
            const createdAt = new Date();
            const expiresAt = new Date(createdAt);
            expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(expiryMinutes || 30));
            
            // In a real app, we would make an API call here
            // For this demo, we'll just create the shortened URL locally
            return {
                originalUrl: longUrl,
                shortUrl: `http://localhost:3000/${finalShortcode}`,
                shortcode: finalShortcode,
                createdAt,
                expiresAt,
                clicks: 0,
                clickDetails: []
            };
        });
        
        // Save to local storage
        const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
        const updatedUrls = [...existingUrls, ...newShortenedUrls];
        localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
        
        // Update state
        setShortenedUrls(newShortenedUrls);
        
        // Reset form
        setUrlInputs([{ longUrl: '', shortcode: '', expiryMinutes: '30' }]);
        
        setAlert({
            open: true,
            message: `🎉 Successfully shortened ${newShortenedUrls.length} URL(s)!`,
            severity: 'success'
        });
        
        Logger.info(`Successfully shortened ${newShortenedUrls.length} URLs`);
    };
    
    // Copy URL to clipboard
    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        setAlert({
            open: true,
            message: '📋 URL copied to clipboard!',
            severity: 'success'
        });
        Logger.info('URL copied to clipboard');
    };
    
    // Close alert
    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };
    
    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    URL Shortener
                </Typography>
                
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    {/* The main form for entering URLs to shorten */}
                    <form onSubmit={handleSubmit}>
                        {urlInputs.map((input, index) => (
                            <Box key={index} mb={3}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">
                                            URL #{index + 1}
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        {/* Input for the long URL */}
                                        <TextField
                                            label="Long URL"
                                            value={input.longUrl}
                                            onChange={e => handleInputChange(index, 'longUrl', e.target.value)}
                                            fullWidth
                                            required
                                            placeholder="Paste your long link here..."
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={5} sm={4}>
                                        {/* Input for custom shortcode */}
                                        <TextField
                                            label="Shortcode (optional)"
                                            value={input.shortcode}
                                            onChange={e => handleInputChange(index, 'shortcode', e.target.value)}
                                            fullWidth
                                            placeholder="e.g. mylink123"
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={5} sm={4}>
                                        {/* Input for expiry time */}
                                        <TextField
                                            label="Expiry (minutes)"
                                            value={input.expiryMinutes}
                                            onChange={e => handleInputChange(index, 'expiryMinutes', e.target.value)}
                                            fullWidth
                                            type="number"
                                            inputProps={{ min: 1 }}
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={2} sm={2}>
                                        {/* Remove button for this input */}
                                        {urlInputs.length > 1 && (
                                            <Tooltip title="Remove this URL input">
                                                <IconButton onClick={() => removeUrlInput(index)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 2 }} />
                            </Box>
                        ))}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={addUrlInput}
                                disabled={urlInputs.length >= 5}
                            >
                                Add Another URL
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                            >
                                Shorten URLs
                            </Button>
                        </Box>
                    </form>
                </Paper>

                {/* Show shortened URLs after submission */}
                {shortenedUrls.length > 0 && (
                    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Here are your shiny new short links:
                        </Typography>
                        <List>
                            {shortenedUrls.map((url, idx) => (
                                <ListItem key={idx} secondaryAction={
                                    <Tooltip title="Copy to clipboard">
                                        <IconButton edge="end" onClick={() => copyToClipboard(url.shortUrl)}>
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                }>
                                    <ListItemText
                                        primary={url.shortUrl}
                                        secondary={
                                            <>
                                                <span>Original: {url.originalUrl}</span><br />
                                                <span>Expires: {formatDate(url.expiresAt)}</span>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}

                {/* Snackbar for alerts */}
                <Snackbar open={alert.open} autoHideDuration={4000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default UrlShortenerPage;