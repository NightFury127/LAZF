const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Create a simple Express server to display OTPs
const app = express();
const PORT = 5001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Store OTPs in memory and in a file
const otps = {};
const otpLogFile = path.join(__dirname, "otp-log.txt");

// Check if OTP log file exists, if not create it
if (!fs.existsSync(otpLogFile)) {
  fs.writeFileSync(otpLogFile, "# OTP Log\n\n", "utf8");
} else {
  // Read existing OTPs from the log file
  try {
    const logContent = fs.readFileSync(otpLogFile, "utf8");
    // Updated regex to match the timestamp format in the log file
    const otpEntries = logContent.match(
      /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) - Email: (.+) - OTP: (\d+)/g
    );

    console.log("Reading OTP log file...");
    console.log("Log content length:", logContent.length);
    console.log("Found OTP entries:", otpEntries ? otpEntries.length : 0);

    if (otpEntries) {
      otpEntries.forEach((entry) => {
        // Updated regex to capture timestamp, email and OTP
        const match = entry.match(
          /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) - Email: (.+) - OTP: (\d+)/
        );
        if (match && match.length === 4) {
          const timestamp = match[1];
          const email = match[2];
          const otp = match[3];

          otps[email] = {
            otp,
            timestamp: timestamp,
          };

          console.log(
            `Loaded OTP from log file: ${email} - ${otp} (${timestamp})`
          );
        } else {
          console.log("Failed to parse entry:", entry);
        }
      });
    }
  } catch (err) {
    console.error("Error reading OTP log file:", err);
  }
}

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Endpoint to receive OTPs
app.post("/log-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  console.log(`Received OTP request for ${email}: ${otp}`);

  // Store OTP in memory
  const timestamp = new Date().toISOString();
  otps[email] = {
    otp,
    timestamp,
  };

  // Append to log file in the format that matches our parser
  const logEntry = `${timestamp} - Email: ${email} - OTP: ${otp}\n`;
  fs.appendFileSync(otpLogFile, logEntry, "utf8");

  console.log(`OTP logged for ${email}: ${otp}`);

  res.status(200).json({ message: "OTP logged successfully" });
});

// Endpoint to get all OTPs
app.get("/otps", (req, res) => {
  res.status(200).json(otps);
});

// Endpoint to manually add an OTP for testing
app.get("/add-test-otp", (req, res) => {
  const email = req.query.email || "test@example.com";
  const otp =
    req.query.otp || Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in memory
  const timestamp = new Date().toISOString();
  otps[email] = {
    otp,
    timestamp,
  };

  // Append to log file
  const logEntry = `${timestamp} - Email: ${email} - OTP: ${otp}\n`;
  fs.appendFileSync(otpLogFile, logEntry, "utf8");

  console.log(`Test OTP added for ${email}: ${otp}`);

  res.send(`
    <html>
      <head>
        <title>Test OTP Added</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #111;
            color: #fff;
          }
          h1 {
            color: #FFD700;
          }
          .otp-code {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #FFD700;
            background-color: #333;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
          }
          .btn {
            background-color: #FFD700;
            color: #000;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            margin: 10px 0;
            text-decoration: none;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <h1>Test OTP Added</h1>
        <p>Email: ${email}</p>
        <p>OTP: <span class="otp-code">${otp}</span></p>
        <p>Timestamp: ${timestamp}</p>
        <a href="/" class="btn">Back to OTP Display</a>
      </body>
    </html>
  `);
});

// Serve a simple HTML page to display OTPs
app.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Display</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #111;
          color: #fff;
        }
        h1, h2 {
          color: #FFD700;
        }
        .otp-container {
          margin-top: 20px;
        }
        .otp-card {
          background-color: #222;
          border: 1px solid #FFD700;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #FFD700;
          background-color: #333;
          padding: 10px;
          border-radius: 5px;
          display: inline-block;
          margin-top: 10px;
        }
        .timestamp {
          color: #999;
          font-size: 12px;
          margin-top: 10px;
        }
        .refresh-btn {
          background-color: #FFD700;
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .no-otps {
          color: #999;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <h1>Lazreus Tech OTP Display</h1>
      <p>This page displays OTPs generated during the registration process.</p>

      <button class="refresh-btn" onclick="fetchOTPs()">Refresh OTPs</button>

      <div class="otp-container" id="otpContainer">
        <p class="no-otps">No OTPs logged yet. Register a new account to see OTPs here.</p>
      </div>

      <script>
        // Function to fetch and display OTPs
        function fetchOTPs() {
          fetch('/otps')
            .then(response => response.json())
            .then(data => {
              const container = document.getElementById('otpContainer');

              // Clear container
              container.innerHTML = '';

              // Check if there are any OTPs
              const emails = Object.keys(data);
              if (emails.length === 0) {
                container.innerHTML = '<p class="no-otps">No OTPs logged yet. Register a new account to see OTPs here.</p>';
                return;
              }

              // Sort emails by timestamp (newest first)
              emails.sort((a, b) => {
                return new Date(data[b].timestamp) - new Date(data[a].timestamp);
              });

              // Create OTP cards
              emails.forEach(email => {
                const otpInfo = data[email];
                const card = document.createElement('div');
                card.className = 'otp-card';

                card.innerHTML = \`
                  <h2>\${email}</h2>
                  <p>Your OTP code is:</p>
                  <div class="otp-code">\${otpInfo.otp}</div>
                  <p class="timestamp">Generated: \${new Date(otpInfo.timestamp).toLocaleString()}</p>
                \`;

                container.appendChild(card);
              });
            })
            .catch(error => {
              console.error('Error fetching OTPs:', error);
              document.getElementById('otpContainer').innerHTML = '<p>Error loading OTPs. Please try again.</p>';
            });
        }

        // Initial fetch
        fetchOTPs();

        // Refresh every 10 seconds
        setInterval(fetchOTPs, 10000);
      </script>
    </body>
    </html>`;

  res.send(html);
});

// Start the server
app.listen(PORT, () => {
  console.log(`OTP Display server running at http://localhost:${PORT}`);
  console.log(`OTPs are being logged to: ${otpLogFile}`);
});
