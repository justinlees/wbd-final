# Use Node.js LTS version as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5500

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
