# Backend Dockerfile - This file contains instructions to build backend image

# Stage 1: Use Node.js official image as base
# This downloads Node.js and NPM pre-installed
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json from your computer to container
COPY package.json package-lock.json ./

# Install all dependencies (express, aws-sdk, uuid, etc.)
# npm ci is like npm install but better for Docker (deterministic)
RUN npm ci

# Copy all backend code to container
COPY . .

# Expose port 5000 (tells Docker this container listens on 5000)
# This doesn't actually publish the port, just documents it
EXPOSE 5000

# Set NODE_ENV to production (for optimization)
ENV NODE_ENV=production

# Command to run when container starts
# This runs: node server.js
CMD ["node", "server.js"]
