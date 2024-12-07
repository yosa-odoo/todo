FROM node:14

WORKDIR /app

COPY app.js .
COPY views ./views
COPY package.json .

RUN npm install

EXPOSE 3000

VOLUME ["/app/database"]

CMD ["node", "app.js"]