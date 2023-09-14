const express = require('express');
const bodyparser = require('body-parser');
const sequelize = require('./config/database');
const redisClient = require('./config/redis.js');
const logger = require("./utils/logger");

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

//test route
app.get('/',async (req, res, next) => {
  res.send('Hello World');
});

//CRUD routes
app.use('/users', require('./routes/users'));
app.use('/notes', require('./routes/notes'));

// redis connection test
redisClient.on('connect', () => {
  logger.info('Redis connected');
});
//sync database
sequelize
  .sync()
  .then(result => {
    logger.info("Database connected");
    logger.info("Server started");
    app.listen(3000);
  })
  .catch(err => console.log(err));
