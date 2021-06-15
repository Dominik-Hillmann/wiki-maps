FROM node:14-alpine

RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
# Set environment variable
ENV PORT=5000
EXPOSE 5000

# How to run actual application
CMD ["npm", "start"]