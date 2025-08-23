# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the Vite app
RUN npm run build

# Expose the default Vite preview port
EXPOSE 4173

# Run the preview server
CMD ["npm", "run", "preview"]
