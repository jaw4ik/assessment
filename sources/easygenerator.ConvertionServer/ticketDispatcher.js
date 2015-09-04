'use strict';

var 
    _ = require('lodash'),
    uuid = require('node-uuid');


var tickets = [];

function create() {
    var ticket = uuid.v4();
    tickets.push(ticket);
    return ticket;
}

function use(ticket) {
    if (ticket && (_.indexOf(tickets, ticket) > -1)) {
        _.pull(tickets, ticket);
        return true;
    } else {
        return false;
    }
}

module.exports = {
    create: create,
    use: use
};