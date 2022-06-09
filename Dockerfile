FROM node:18-alpine


WORKDIR /usr/src/app

RUN npm install -g nodemon



CMD [ "yarn", "dev", "-s"]