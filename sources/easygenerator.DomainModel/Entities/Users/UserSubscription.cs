using System;

namespace easygenerator.DomainModel.Entities.Users
{
    public class UserSubscription
    {
        public UserSubscription(AccessType accessType, DateTime expirationDate)
        {
            AccessType = accessType;
            ExpirationDate = expirationDate;
        }

        public AccessType AccessType { get; protected internal set; }
        public DateTime ExpirationDate { get; protected internal set; }
    }
}
