FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy package manifest (context is mocks/mpesa/)
COPY package.json ./

# Install dependencies (no workspace lockfile needed — no @bitremit/* deps)
RUN pnpm install

# Copy source
COPY . .

# Build
RUN pnpm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]