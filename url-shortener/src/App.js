import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Container, Box, 
  Button, CssBaseline, createTheme, ThemeProvider 
} from '@mui/material';
import UrlShortenerPage from './components/UrlShortenerPage';
import UrlStatisticsPage from './components/UrlStatisticsPage';
import RedirectHandler from './components/RedirectHandler';
import Logger from './utils/logger';

// Create a Material UI theme for a friendly look
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// App.js - Main React app for the URL Shortener
// This is where the magic starts.
// Written by a human (who likes short links)
// TODO: Add a settings page!

function App() {
  // Log application start (just for fun)
  React.useEffect(() => {
    Logger.info('🚀 URL Shortener application started');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* AppBar is the friendly blue bar at the top */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              URL Shortener
            </Typography>
            {/* Navigation buttons */}
            <Button color="inherit" component={Link} to="/">
              Shorten URLs
            </Button>
            <Button color="inherit" component={Link} to="/statistics">
              Statistics
            </Button>
          </Toolbar>
        </AppBar>
        
        <Container>
          <Box my={4}>
            {/* Define the routes for the app */}
            <Routes>
              <Route path="/" element={<UrlShortenerPage />} />
              <Route path="/statistics" element={<UrlStatisticsPage />} />
              <Route path="/:shortcode" element={<RedirectHandler />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;