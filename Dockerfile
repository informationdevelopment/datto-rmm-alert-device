FROM node:14
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
EXPOSE 9229
WORKDIR /opt/approot
RUN chown node:node .
USER node
COPY package.json package-lock.json ./
RUN npm install --no-optional && npm cache clean --force
WORKDIR /opt/approot/app
COPY --chown=node:node . .
CMD [ "node", "src/index.js" ]
