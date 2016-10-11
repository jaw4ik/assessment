using easygenerator.DomainModel.Entities;

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
