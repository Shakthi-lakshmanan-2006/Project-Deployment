# Frontend Dockerfile - Multi-stage build for optimized React app

# Stage 1: Build stage - Create optimized React build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

COPY . .

# Build the React app for production
# This creates a 'build' folder with optimized files
RUN npm run build

# Stage 2: Production stage - Serve using lightweight web server
# Use nginx to serve static files (much lighter than Node)
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React app from builder stage to nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 (default HTTP port)
EXPOSE 80

# Nginx starts automatically
CMD ["nginx", "-g", "daemon off;"]
