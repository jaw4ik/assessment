using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events
{
    public class UserUpgradedToStarter : UserEvent
    {
        public UserUpgradedToStarter(User user)
            : base(user)
        {

        }
    }
}
