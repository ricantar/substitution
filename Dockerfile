# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Step 1: Install dependencies globally
RUN npm install -g @nestjs/cli

# Step 2: Copy package.json and package-lock.json
COPY package*.json ./

# Step 3: Install dependencies
RUN npm install

# Step 4: Copy the rest of the application code, including the .env file
COPY . .

# Step 5: Copy the .env file (ensure it's in the root of your project)
COPY .env .env

# Step 6: Build the NestJS application
RUN npm run build

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Start the application
CMD ["npm", "run", "start:prod"]
