using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserUpgradedToStarter : UserEvent
    {
        internal UserUpgradedToStarter(User user)
            : base(user)
        {

        }
    }
}
