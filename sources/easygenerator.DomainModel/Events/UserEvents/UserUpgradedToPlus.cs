﻿using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserUpgradedToPlus : UserEvent
    {
        public UserUpgradedToPlus(User user)
            : base(user)
        {

        }
    }
}