using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserUpgradedToAcademyBT : UserEvent
    {
        internal UserUpgradedToAcademyBT(User user)
            : base(user)
        {

        }
    }
}
