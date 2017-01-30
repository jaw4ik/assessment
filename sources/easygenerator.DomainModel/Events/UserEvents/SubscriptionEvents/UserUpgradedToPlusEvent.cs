using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.DomainModel.Events.UserEvents.SubscriptionEvents
{
    public class UserUpgradedToPlusEvent : UserSubscriptionUpdatedEvent
    {
        internal UserUpgradedToPlusEvent(User user)
            : base(user)
        {

        }
    }
}
