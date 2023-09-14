FROM node:14.20.0

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

COPY .env.example .env

EXPOSE 3000

CMD [ "node", "index.js" ]

