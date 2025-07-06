# Lazreus Tech

Lazreus Tech is a technology services company founded in 2025, targeting startups and small businesses with services including website/app development, DevOps, UX design, creative services, promotional assistance, inventory management, and wearables.

This repository contains the codebase for the Lazreus Tech website with a modern black/gold/white color scheme and futuristic styling.

## Project Overview

The project includes both a static HTML/CSS/JS version and a Next.js version of the Lazreus Tech website. The HTML version is the primary version that runs by default.

### Features

- Responsive design for all device sizes
- Authentication system with email OTP verification
- Role-based access (CUSTOMER/ADMIN)
- Modern UI with black/gold/white color scheme
- Services showcase
- Contact form
- Mobile-friendly navigation

## Project Structure

```
├── app/                  # Next.js app directory
├── components/           # React components
├── css/                  # CSS styles for HTML version
├── images/               # Image assets
│   └── favicon/          # Favicon files
├── js/                   # JavaScript files for HTML version
├── lib/                  # Utility functions
├── prisma/               # Prisma ORM schema and migrations
├── public/               # Static assets for Next.js
├── server/               # Server-side code
│   └── tests/            # Server tests
├── *.html                # HTML pages
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## Recent Improvements

1. **Enhanced Security**

   - Implemented CSRF protection
   - Added rate limiting for login attempts
   - Switched to HTTP-only cookies for authentication
   - Removed plaintext password storage
   - Improved password validation
   - Added secure JWT token handling

2. **Performance Optimizations**

   - Added proper caching headers for static assets
   - Implemented compression for responses
   - Optimized DOM manipulation with CSS classes
   - Improved animations with requestAnimationFrame
   - Added will-change hints for smoother animations
   - Implemented efficient event handling

3. **Accessibility Enhancements**

   - Added ARIA attributes for screen readers
   - Improved keyboard navigation support
   - Enhanced focus management
   - Added screen reader only text
   - Improved color contrast
   - Added reduced motion support

4. **Code Organization and Architecture**

   - Modularized server code into controllers, routes, middleware, and utilities
   - Improved error handling
   - Added comprehensive validation
   - Centralized configuration in environment variables
   - Enhanced documentation
   - Improved code reusability

5. **Enhanced UI/UX**

   - Improved responsive design for mobile devices
   - Enhanced mobile menu accessibility
   - Improved form validation feedback
   - Added toast notifications
   - Enhanced button styles and interactions
   - Improved loading states

6. **Development Experience**
   - Added detailed environment variable documentation
   - Improved startup scripts
   - Enhanced error logging
   - Added health check endpoints
   - Improved code comments
   - Added comprehensive README

## Running the Website

### HTML Version (Main)

The main version of the website is built with HTML, CSS, and JavaScript. To run it:

1. **Using the batch file:**

   ```
   start_website.bat
   ```

2. **Using npm:**

   ```
   npm run start:html
   ```

3. **Manually:**

   ```
   # Start the authentication server
   node server/index.js

   # In another terminal, start the HTML server
   node html-server.js

   # In another terminal, start the OTP display server
   node otp-display.js
   ```

The website will be available at http://localhost:3000

#### Accessing OTPs

When you register on the website, you'll need an OTP to verify your account. The OTP display server makes it easy to see these OTPs:

- The OTP display page will automatically open at http://localhost:5001
- This page shows all OTPs generated during registration
- OTPs are also logged to the console and saved in `otp-log.txt`

### Next.js Version (Alternative)

An alternative version of the website is built with Next.js, TailwindCSS, Prisma ORM, and NextAuth.js. To run it:

```
npm run dev
```

The Next.js version will be available at http://localhost:3000 (make sure the HTML version is not running).
