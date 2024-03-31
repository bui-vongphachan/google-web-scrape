FROM node:19-alpine3.16 as builder

WORKDIR /app
COPY . .
RUN npm i --force && npm run build

CMD ["npm", "run", "start"]