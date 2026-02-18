# Use official Node image
# FROM node:20-alpine

FROM node:20

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=qwerty

RUN mkdir -p app

COPY . /app

CMD ["node", "/app/server.js"]