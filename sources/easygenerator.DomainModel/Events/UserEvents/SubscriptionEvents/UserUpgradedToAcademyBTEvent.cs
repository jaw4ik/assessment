using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents.SubscriptionEvents
{
    public class UserUpgradedToAcademyBTEvent : UserSubscriptionUpdatedEvent
    {
        internal UserUpgradedToAcademyBTEvent(User user)
            : base(user)
        {

        }
    }
}
