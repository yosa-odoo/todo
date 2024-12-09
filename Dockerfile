FROM node:14

WORKDIR /app

COPY app.js .
COPY db.js .
COPY templateEngine.js .
COPY views ./views
COPY custom_modules ./custom_modules
COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 3000

VOLUME ["/app/database"]

CMD ["node", "app.js"]

