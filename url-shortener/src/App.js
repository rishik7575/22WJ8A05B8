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

// Create a theme
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

function App() {
  // Log application start
  React.useEffect(() => {
    Logger.info('URL Shortener application started');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              URL Shortener
            </Typography>
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