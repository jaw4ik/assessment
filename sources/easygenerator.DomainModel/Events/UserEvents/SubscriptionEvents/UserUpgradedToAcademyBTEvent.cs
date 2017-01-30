using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

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
