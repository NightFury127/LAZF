/**
 * Simple script to display the latest OTP from the log file
 */

const fs = require('fs');
const path = require('path');

// Path to the OTP log file
const otpLogFile = path.join(__dirname, 'otp-log.txt');

// Check if the log file exists
if (!fs.existsSync(otpLogFile)) {
  console.log('OTP log file not found.');
  process.exit(1);
}

// Read the log file
const logContent = fs.readFileSync(otpLogFile, 'utf8');

// Extract OTPs using regex
const otpEntries = logContent.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) - Email: (.+) - OTP: (\d+)/g);

if (!otpEntries || otpEntries.length === 0) {
  console.log('No OTPs found in the log file.');
  process.exit(1);
}

// Parse the entries
const otps = [];
otpEntries.forEach(entry => {
  const match = entry.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) - Email: (.+) - OTP: (\d+)/);
  if (match && match.length === 4) {
    const timestamp = new Date(match[1]);
    const email = match[2];
    const otp = match[3];
    
    otps.push({
      timestamp,
      email,
      otp
    });
  }
});

// Sort by timestamp (newest first)
otps.sort((a, b) => b.timestamp - a.timestamp);

// Display the OTPs
console.log('\n=== OTPs from Log File ===\n');

otps.forEach((entry, index) => {
  console.log(`[${index + 1}] Email: ${entry.email}`);
  console.log(`    OTP: ${entry.otp}`);
  console.log(`    Time: ${entry.timestamp.toLocaleString()}`);
  console.log('');
});

// Display the latest OTP with high visibility
if (otps.length > 0) {
  const latest = otps[0];
  
  console.log('\n=======================================================');
  console.log(`🔑 LATEST OTP FOR ${latest.email}: ${latest.otp}`);
  console.log('=======================================================\n');
}
