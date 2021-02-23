FROM node:14

# Set up Node environemt, defaulting to production
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Allow Node debugging
EXPOSE 9229

WORKDIR /opt/approot

# Install NPM dependencies
COPY package.json package-lock.json ./
RUN npm install --no-optional && npm cache clean --force

# Copy in source files in a subdirectory
# to avoid issues with bind-mounting node_modules
WORKDIR /opt/approot/app

# Start the app
CMD [ "node", "src/index.js" ]
