FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn install --production

ENTRYPOINT [ "node", "src" ]
