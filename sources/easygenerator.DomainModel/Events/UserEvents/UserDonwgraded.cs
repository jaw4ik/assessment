using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserDowngraded : UserEvent
    {
        internal UserDowngraded(User user)
            : base(user)
        {
        }

    }
}
