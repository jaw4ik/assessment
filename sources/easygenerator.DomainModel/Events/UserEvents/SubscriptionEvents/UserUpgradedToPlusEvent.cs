using easygenerator.DomainModel.Entities;

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
