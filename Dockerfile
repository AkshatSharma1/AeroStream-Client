# Stage 1: Build the React Application
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built static files from Stage 1 to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration (we will create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]