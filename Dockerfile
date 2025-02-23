# syntax=docker/dockerfile:1

FROM node:22.14.0-alpine AS base

WORKDIR /app

COPY [ "package.json", "./" ]

FROM base AS dev
ENV NODE_ENV=dev
RUN apk add --no-cache --virtual .gyp python3 make g++ postgresql-dev
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]
