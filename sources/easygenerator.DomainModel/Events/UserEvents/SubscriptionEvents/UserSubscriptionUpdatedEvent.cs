using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents.SubscriptionEvents
{
    public class UserSubscriptionUpdatedEvent : UserEvent
    {
        internal UserSubscriptionUpdatedEvent(User user)
            : base(user)
        {

        }
    }
}
