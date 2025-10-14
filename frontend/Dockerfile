# Build React app
FROM node:20.1-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files and build
COPY . .
RUN npm run build

# Serve app with Nginx 
FROM nginx:alpine

# Copy the build output to Nginx's default web directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy your custom nginx.conf (important for SPA routes)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]