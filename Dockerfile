# Use an official Node.js image as a parent image
FROM node:18-slim

# Install dependencies required by chrome-aws-lambda
RUN apt-get update && apt-get install -y \
  libnss3 \
  libgdk-pixbuf2.0-0 \
  libxss1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libgbm1 \
  libx11-xcb1 \
  && rm -rf /var/lib/apt/lists/*

# Create and set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app will run on
EXPOSE 8080

# Run the application
CMD ["node", "index.js"]
