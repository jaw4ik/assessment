using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

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
