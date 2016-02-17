'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');

var tickets = [];

module.exports = {
    create: () => {
        let ticket = uuid.v4();
		tickets.push(ticket);
		return ticket;
    },
    use: ticket => {
        if (ticket && (_.indexOf(tickets, ticket) > -1)) {
			_.pull(tickets, ticket);
			return true;
		} else {
			return false;
		}
    }
};