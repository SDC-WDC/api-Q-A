FROM node:16.14.2-alpine3.15

ENV NODE_ENV=production

WORKDIR /app

COPY ./ ./

RUN npm install

CMD ["node", "index.js"]
