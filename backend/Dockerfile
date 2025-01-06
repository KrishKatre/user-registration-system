FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copy package files and adjust permissions
COPY package*.json ./
COPY .env /usr/src/app/.env
# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .



# Switch to Puppeteer's default user
USER pptruser

CMD ["node", "index.js"]
