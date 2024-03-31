FROM node:lts-alpine3.19

WORKDIR /app

COPY . /app

RUN npm install && npm install typescript -g && npm run build

CMD ["npm", "start"]