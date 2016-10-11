using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents.SubscriptionEvents
{
    public class UserDowngradedEvent : UserSubscriptionUpdatedEvent
    {
        internal UserDowngradedEvent(User user)
            : base(user)
        {
        }

    }
}
