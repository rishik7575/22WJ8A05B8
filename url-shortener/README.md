# URL Shortener Application

👋 Hey there, friend! Welcome to the URL Shortener project—a fun little app to make your long, messy links short and sweet. Built with React, sprinkled with some Material UI, and packed with features to help you track your links. Hope you enjoy using it as much as I enjoyed building it!

## Features

- ✂️ Shorten up to 5 URLs at once (because who has time for one at a time?)
- 🏷️ Custom shortcodes (optional, for the creative types)
- ⏰ Configurable expiry time (default: 30 minutes, but you do you)
- 📊 URL statistics tracking (see who's clicking your stuff)
- 🔢 Click analytics (because numbers are fun)
- 🎨 Material UI interface (looks pretty nice, if I say so myself)

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

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Start the development server:**
   ```
   npm start
   ```

3. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000) (or whatever port it tells you!)

## How to Use

### Shortening URLs

1. Enter a long URL in the input field
2. (Optional) Provide a custom shortcode (4-10 alphanumeric characters)
3. (Optional) Set an expiry time (default: 30 minutes)
4. Click the "Shorten URLs" button
5. Copy the shortened URL from the results section and share away!

### Viewing Statistics

1. Click the "Statistics" tab in the navigation bar
2. See all your shortened URLs with their click counts
3. Expand a URL to see detailed click analytics (timestamp, referrer, etc.)

## Implementation Details

- ⚛️ Uses React for the frontend
- 🎨 Material UI for the user interface
- 📝 Custom logging middleware for tracking events
- 🕵️‍♂️ Client-side validation for URLs and inputs
- 💾 Local storage for persisting shortened URLs
- 🚦 React Router for handling redirections

## Notes & Tips

- This is a client-side only implementation (no backend, just vibes)
- All data is stored in your browser's localStorage (so it's private to you)
- In a production environment, this would be connected to a backend API
- If you find a bug, let me know! Or fix it yourself and be a hero 😄

## TODO / Known Issues

- 🌙 Add dark mode support
- 📤 Add export to CSV in statistics
- 🚫 Handle 404s more gracefully on redirects
- ⚙️ Add a settings page
- 🛠️ Add service worker for offline support
- (You know, the usual stuff we never get around to!)

---

Happy shortening! 🚀