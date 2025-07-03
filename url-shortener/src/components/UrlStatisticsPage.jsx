import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, 
    Collapse, IconButton, Chip, Divider, Grid, 
    Card, CardContent, Tooltip
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { formatDate } from '../utils/validators';
import Logger from '../utils/logger';

// UrlStatisticsPage.jsx - Page for viewing all your shortened URLs and their stats
// This page is your analytics dashboard for short links!
// Written by a human (who likes numbers)

// Row component for expandable table
const UrlRow = ({ url, onCopy }) => {
    const [open, setOpen] = useState(false);
    
    // Check if URL is expired
    const isExpired = new Date() > new Date(url.expiresAt);
    
    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                        aria-label={open ? 'Collapse details' : 'Expand details'}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Box display="flex" alignItems="center">
                        {url.shortUrl}
                        <Tooltip title="Copy to clipboard">
                            <IconButton 
                                size="small" 
                                onClick={() => onCopy(url.shortUrl)}
                                sx={{ ml: 1 }}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography variant="caption" display="block" color="textSecondary">
                        {url.originalUrl.length > 50 
                            ? `${url.originalUrl.substring(0, 50)}...` 
                            : url.originalUrl}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Chip 
                        label={isExpired ? 'Expired' : 'Active'} 
                        color={isExpired ? 'error' : 'success'} 
                        size="small" 
                    />
                </TableCell>
                <TableCell align="center">{url.clicks}</TableCell>
                <TableCell>
                    <Typography variant="body2">
                        Created: {formatDate(url.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                        Expires: {formatDate(url.expiresAt)}
                    </Typography>
                </TableCell>
            </TableRow>
            
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Click Details
                            </Typography>
                            
                            {url.clickDetails.length === 0 ? (
                                <Typography variant="body2" color="textSecondary">
                                    No clicks recorded yet. Share your link to see some stats!
                                </Typography>
                            ) : (
                                <Table size="small" aria-label="click details">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Timestamp</TableCell>
                                            <TableCell>IP Address</TableCell>
                                            <TableCell>Referrer</TableCell>
                                            <TableCell>User Agent</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {url.clickDetails.map((click, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{formatDate(click.timestamp)}</TableCell>
                                                <TableCell>{click.ipAddress}</TableCell>
                                                <TableCell>{click.referrer || 'Direct'}</TableCell>
                                                <TableCell>{click.userAgent}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const UrlStatisticsPage = () => {
    const [urls, setUrls] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        expired: 0,
        totalClicks: 0
    });
    
    // Load URLs from localStorage
    useEffect(() => {
        const loadUrls = () => {
            try {
                const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
                setUrls(storedUrls);
                
                // Calculate stats
                const now = new Date();
                const active = storedUrls.filter(url => new Date(url.expiresAt) > now).length;
                const totalClicks = storedUrls.reduce((sum, url) => sum + url.clicks, 0);
                
                setStats({
                    total: storedUrls.length,
                    active,
                    expired: storedUrls.length - active,
                    totalClicks
                });
                
                Logger.info('📊 URL statistics loaded from localStorage');
            } catch (error) {
                Logger.error(`Error loading URLs: ${error.message}`);
            }
        };
        
        loadUrls();
    }, []);
    
    // Copy URL to clipboard
    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        Logger.info('URL copied to clipboard');
    };
    
    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    URL Statistics
                </Typography>
                {/* Show some fun stats at the top */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total URLs
                                </Typography>
                                <Typography variant="h4">
                                    {stats.total}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Active URLs
                                </Typography>
                                <Typography variant="h4" color="success.main">
                                    {stats.active}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Expired URLs
                                </Typography>
                                <Typography variant="h4" color="error.main">
                                    {stats.expired}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Clicks
                                </Typography>
                                <Typography variant="h4">
                                    {stats.totalClicks}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                {/* Table of all URLs */}
                <Paper elevation={3}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Short URL</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Clicks</TableCell>
                                    <TableCell>Dates</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {urls.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No URLs found. Go shorten some links!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    urls.map((url, idx) => (
                                        <UrlRow key={idx} url={url} onCopy={copyToClipboard} />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Container>
    );
};

export default UrlStatisticsPage;