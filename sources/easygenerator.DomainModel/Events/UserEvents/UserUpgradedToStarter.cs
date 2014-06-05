using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserUpgradedToStarter : UserEvent
    {
        public UserUpgradedToStarter(User user)
            : base(user)
        {

        }
    }
}
