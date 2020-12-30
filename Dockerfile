# CodingJosh's Anime Stats Dockerfile
# This is oriented toward deployment on Elastic Beanstalk

# Use Node 15 based on Alpine Linux
FROM node:15-alpine

# Install build tools for node-gyp dependencies
RUN apk add python make gcc g++

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install dependencies
RUN npm install

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "npm", "start" ]
