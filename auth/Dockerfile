# Use official Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install dev tools for hot reload
RUN npm install --save-dev ts-node nodemon

# Copy source code
COPY . .

# Expose app port
EXPOSE 3000

# Run the app with nodemon watching src folder
CMD ["npx", "nodemon", "--watch", "src", "--exec", "ts-node", "src/index.ts"]