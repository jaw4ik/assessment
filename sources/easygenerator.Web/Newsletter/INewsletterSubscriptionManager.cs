﻿using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Newsletter
{
    public interface INewsletterSubscriptionManager
    {
        bool CreateSubscription(string userEmail, string firstname, string lastname, string userRole, AccessType accessType);
        bool UpdateSubscription(string userEmail, string firstname, string lastname, string userRole, AccessType accessType);
    }
}