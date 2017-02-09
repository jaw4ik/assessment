var signIn = require('./signIn');
var signUp = require('./signUp');
var courses = require('./courses');

module.exports = {
    signIn,
    signUp,
    courses,
    DEFAULT_PASSWORD: 'password',
    INCORRECT_EMAIL: 'incorrect_email',
    PAGE_LOAD_LIMIT: 30000
}