#!/bin/bash

# This script runs AFTER the server is confirmed to be up by start-server-and-test

echo "1. Running Playwright Setup Scripts..."

# Run the authentication scripts (which require the server to be running)
node scripts/save-admin-auth.js
node scripts/save-club-auth.js
node scripts/save-user-auth.js

echo "2. Starting Playwright Tests..."

# Finally, run the main Playwright tests
npx playwright test