FROM node:12.13.0-alpine
WORKDIR /app
COPY . /app
CMD npm install
CMD npm run build
CMD npm start
EXPOSE 8081

