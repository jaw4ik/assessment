using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserUpgradedToAcademy : UserEvent
    {
        internal UserUpgradedToAcademy(User user)
            : base(user)
        {

        }
    }
}
