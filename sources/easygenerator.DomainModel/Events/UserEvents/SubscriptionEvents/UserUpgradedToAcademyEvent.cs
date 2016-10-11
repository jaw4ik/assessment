using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents.SubscriptionEvents
{
    public class UserUpgradedToAcademyEvent : UserSubscriptionUpdatedEvent
    {
        internal UserUpgradedToAcademyEvent(User user)
            : base(user)
        {

        }
    }
}
