FROM node:8.17 AS build
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install -g npm@6.13.4 \
    && node -v \
    && npm -v

RUN export NODE_OPTIONS=--max_old_space_size=8096 \
    && npm ci

COPY ./ .
RUN export NODE_OPTIONS=--max_old_space_size=8096 && npm run build --stats-json --source-map=false
RUN ls -la /usr/src/app/dist

### STAGE 2: Run ###
FROM nginx:1.21.4-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
