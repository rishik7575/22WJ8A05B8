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
            Logger.info('Added new URL input field');
        } else {
            setAlert({
                open: true,
                message: 'Maximum 5 URLs allowed at once',
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
        Logger.info(`Removed URL input field at index ${index}`);
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
                    message: `URL #${i+1} is invalid`,
                    severity: 'error'
                });
                return false;
            }
            
            if (!isValidShortcode(shortcode)) {
                setAlert({
                    open: true,
                    message: `Shortcode for URL #${i+1} is invalid (must be 4-10 alphanumeric characters)`,
                    severity: 'error'
                });
                return false;
            }
            
            if (!isValidExpiryTime(expiryMinutes)) {
                setAlert({
                    open: true,
                    message: `Expiry time for URL #${i+1} is invalid`,
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
                message: 'Duplicate shortcodes detected',
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
        
        Logger.info('URL shortening form submitted');
        
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
            message: `Successfully shortened ${newShortenedUrls.length} URL(s)`,
            severity: 'success'
        });
        
        Logger.info(`Successfully shortened ${newShortenedUrls.length} URLs`);
    };
    
    // Copy URL to clipboard
    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        setAlert({
            open: true,
            message: 'URL copied to clipboard',
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
                                        <TextField
                                            fullWidth
                                            label="Long URL"
                                            placeholder="https://example.com/very/long/url"
                                            value={input.longUrl}
                                            onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Custom Shortcode (optional)"
                                            placeholder="e.g., mylink"
                                            value={input.shortcode}
                                            onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
                                            helperText="4-10 alphanumeric characters"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label="Expiry (minutes)"
                                            type="number"
                                            value={input.expiryMinutes}
                                            onChange={(e) => handleInputChange(index, 'expiryMinutes', e.target.value)}
                                            helperText="Default: 30 minutes"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={1}>
                                        {urlInputs.length > 1 && (
                                            <IconButton 
                                                color="error" 
                                                onClick={() => removeUrlInput(index)}
                                                aria-label="Remove URL"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </Grid>
                                
                                {index < urlInputs.length - 1 && (
                                    <Divider sx={{ my: 2 }} />
                                )}
                            </Box>
                        ))}
                        
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addUrlInput}
                                disabled={urlInputs.length >= 5}
                                variant="outlined"
                            >
                                Add URL
                            </Button>
                            
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Shorten URLs
                            </Button>
                        </Box>
                    </form>
                </Paper>
                
                {shortenedUrls.length > 0 && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Shortened URLs
                        </Typography>
                        
                        <List>
                            {shortenedUrls.map((url, index) => (
                                <ListItem key={index} divider={index < shortenedUrls.length - 1}>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center">
                                                <Typography variant="body1" component="span">
                                                    {url.shortUrl}
                                                </Typography>
                                                <Tooltip title="Copy to clipboard">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => copyToClipboard(url.shortUrl)}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" component="span" color="textSecondary">
                                                    Original: {url.originalUrl}
                                                </Typography>
                                                <br />
                                                <Typography variant="body2" component="span" color="textSecondary">
                                                    Expires: {formatDate(url.expiresAt)}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
                
                <Snackbar 
                    open={alert.open} 
                    autoHideDuration={6000} 
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseAlert} severity={alert.severity}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default UrlShortenerPage;