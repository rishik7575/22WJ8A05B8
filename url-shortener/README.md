# URL Shortener Application

A React web application that allows users to shorten URLs and view statistics about those URLs.

## Features

- Shorten up to 5 URLs at once
- Custom shortcodes (optional)
- Configurable expiry time (default: 30 minutes)
- URL statistics tracking
- Click analytics
- Material UI interface

## Project Structure

```
src/
 ├── components/
 │     ├── UrlShortenerPage.jsx - Main page for shortening URLs
 │     ├── UrlStatisticsPage.jsx - Page for viewing URL statistics
 │     └── RedirectHandler.jsx - Handles URL redirections
 ├── utils/
 │     ├── logger.js - Custom logging middleware
 │     └── validators.js - URL and input validation utilities
 ├── App.js - Main application component
 └── index.js - Application entry point
```

## Setup and Running

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Shortening URLs

1. Enter a long URL in the input field
2. Optionally provide a custom shortcode (4-10 alphanumeric characters)
3. Optionally set an expiry time (default: 30 minutes)
4. Click "Shorten URLs" button
5. Copy the shortened URL from the results section

### Viewing Statistics

1. Navigate to the Statistics page
2. View all shortened URLs with their click counts
3. Expand a URL to see detailed click analytics

## Implementation Details

- Uses React for the frontend
- Material UI for the user interface
- Custom logging middleware for tracking events
- Client-side validation for URLs and inputs
- Local storage for persisting shortened URLs
- React Router for handling redirections

## Notes

- This is a client-side only implementation
- All data is stored in the browser's localStorage
- In a production environment, this would be connected to a backend API