import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';

export default function(email, fullName) {
    guard.throwIfNotString(email, 'email is not a string');
    guard.throwIfNotString(fullName, 'fullName is not a string');

    app.trigger(constants.messages.organization.userRegistered + email, { fullName: fullName });
}