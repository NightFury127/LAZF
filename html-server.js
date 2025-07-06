const express = require("express");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");
const app = express();
const PORT = 3000;

// Enable compression for all responses
app.use(compression());

// Add security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for now as it requires more configuration
  })
);

// Cache control middleware for static assets
const cacheControl = (req, res, next) => {
  // Set different cache times based on file types
  const url = req.url;

  // CSS, JS, and image files get longer cache times
  if (url.match(/\.(css|js)$/)) {
    // Cache CSS and JS files for 1 week
    res.setHeader("Cache-Control", "public, max-age=604800");
  } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
    // Cache images for 1 month
    res.setHeader("Cache-Control", "public, max-age=2592000");
  } else if (url.match(/\.(woff|woff2|ttf|eot)$/)) {
    // Cache fonts for 1 month
    res.setHeader("Cache-Control", "public, max-age=2592000");
  } else {
    // HTML files and others get shorter cache times
    res.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour
  }

  next();
};

// Serve static files from the root directory with caching
app.use(
  express.static(path.join(__dirname), {
    etag: true, // Enable ETags for caching
    lastModified: true, // Enable Last-Modified for caching
    setHeaders: (res, path) => {
      // Apply cache control based on file type
      if (path.endsWith(".html")) {
        // HTML files get shorter cache times
        res.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour
      } else if (path.match(/\.(css|js)$/)) {
        // CSS and JS files get longer cache times
        res.setHeader("Cache-Control", "public, max-age=604800"); // 1 week
      } else if (path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
        // Images get longer cache times
        res.setHeader("Cache-Control", "public, max-age=2592000"); // 1 month
      } else if (path.match(/\.(woff|woff2|ttf|eot)$/)) {
        // Fonts get longer cache times
        res.setHeader("Cache-Control", "public, max-age=2592000"); // 1 month
      }
    },
  })
);

// Apply cache control to all routes
app.use(cacheControl);

// Route for the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Routes for other pages
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "services.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});

// Authentication pages should have no-cache headers
app.get("/login", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/signup", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(__dirname, "signup.html"));
});

// Protected pages should have no-cache headers
app.get("/dashboard", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.get("/admin-dashboard", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(__dirname, "admin-dashboard.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`HTML server running at http://localhost:${PORT}`);
});
