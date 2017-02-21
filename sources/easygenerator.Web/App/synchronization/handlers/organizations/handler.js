﻿import userRegistered from './eventHandlers/userRegistered';
import inviteAccepted from './eventHandlers/inviteAccepted';
import inviteDeclined from './eventHandlers/inviteDeclined';
import inviteCreated from './eventHandlers/inviteCreated';
import inviteRemoved from './eventHandlers/inviteRemoved';
import titleUpdated from './eventHandlers/titleUpdated';
import membershipStarted from './eventHandlers/membershipStarted';
import membershipFinished from './eventHandlers/membershipFinished';
import membershipUpdated from './eventHandlers/membershipUpdated';
import userAdded from './eventHandlers/userAdded';
import userUpdated from './eventHandlers/userUpdated';

export default {
    userRegistered: userRegistered,
    inviteAccepted: inviteAccepted,
    inviteDeclined: inviteDeclined,
    inviteCreated: inviteCreated,
    inviteRemoved: inviteRemoved,
    titleUpdated: titleUpdated,
    membershipStarted: membershipStarted,
    membershipFinished: membershipFinished,
    membershipUpdated: membershipUpdated,
    userAdded: userAdded,
    userUpdated: userUpdated
};