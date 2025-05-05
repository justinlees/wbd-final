# backend/Dockerfile
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the backend port
EXPOSE 5500

# Start the backend
CMD ["node", "server.js"]
