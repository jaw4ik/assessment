using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents.SubscriptionEvents
{
    public class UserUpgradedToStarterEvent : UserSubscriptionUpdatedEvent
    {
        internal UserUpgradedToStarterEvent(User user)
            : base(user)
        {

        }
    }
}
