using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserDonwgraded : UserEvent
    {
        public UserDonwgraded(User user)
            : base(user)
        {
        }

    }
}
