FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY . .
RUN npm i --force && npm run build

CMD ["npm", "run", "start"]