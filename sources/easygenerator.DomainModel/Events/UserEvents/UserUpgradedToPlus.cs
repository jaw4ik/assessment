using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserUpgradedToPlus : UserEvent
    {
        internal UserUpgradedToPlus(User user)
            : base(user)
        {

        }
    }
}
