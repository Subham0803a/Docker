# Use official Node image
# FROM node:20-alpine

FROM node:20

# Set working directory
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=

RUN mkdir -p testapp

WORKDIR /app

COPY . /testapp

RUN npm install

CMD ["node", "/testapp/server.js"]