#!/bin/bash

# Start the Google Cloud SQL Proxy in the background
./cloud-sql-proxy tiara-269e6:us-central1:tiarasql --port=5432 &

# Store the Cloud SQL Proxy process ID
CLOUDSQL_PROXY_PID=$!

# Start the development environment (replace with your actual command)
npm run dev

# Wait for the development environment to exit
wait $CLOUDSQL_PROXY_PID
