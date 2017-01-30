using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

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
