FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm add typescript ts-node @types/node --save-dev
RUN pnpm tsc

# Expose the port
EXPOSE 4000

# Start the server
CMD ["pnpm", "start:express"] 