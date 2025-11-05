const jwt = require('./jwt');
const password = require('./password');

module.exports = {
  ...jwt,
  ...password,
};
