FROM node:lts-alpine3.19

WORKDIR /app

COPY . .

RUN npm install && npm install -g typescript ts-node && tsc --build

CMD ["node", "build/index.js"]