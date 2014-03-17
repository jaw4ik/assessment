using System;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class UserSubscriptionObjectMother
    {
        private const AccessType UserAccessType = AccessType.Starter;

        public static UserSubscription Create(AccessType accessType = UserAccessType, DateTime? expirationTime = null)
        {
            return new UserSubscription(accessType, expirationTime);
        }
    }
}
