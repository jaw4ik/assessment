using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

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
