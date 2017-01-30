using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.DomainModel.Events.UserEvents.SubscriptionEvents
{
    public class UserUpgradedToTrialEvent : UserSubscriptionUpdatedEvent
    {
        internal UserUpgradedToTrialEvent(User user)
            : base(user)
        {

        }
    }
}
