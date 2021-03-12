const users = require('./users/users.service.js');
const booklist = require('./booklist/booklist.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(booklist);
};
