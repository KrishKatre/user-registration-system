FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV DATABASE_URL="mongodb+srv://krishkatre06:destiny123@cluster1.mqho8.mongodb.net/user_registration?retryWrites=true&w=majority"
ENV SECRET_KEY="a4b1d3f43a0e8d4e97c85bf16a97b5c2121a8c2c4e6c5d0b2e6d1c6c7a7d9b8c"
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
