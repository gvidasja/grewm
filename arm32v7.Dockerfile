FROM arm32v7/node:alpine

WORKDIR /app

COPY . .

RUN yarn install --production

ENTRYPOINT [ "node", "src" ]