# ===== Stage 1: Build React app =====
FROM node:20.1-alpine AS build

WORKDIR /app

# Accept backend API URL as a build argument
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# ===== Stage 2: Serve app with Nginx =====
FROM nginx:alpine

# Copy the built React app from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy your custom nginx config (with reverse proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
