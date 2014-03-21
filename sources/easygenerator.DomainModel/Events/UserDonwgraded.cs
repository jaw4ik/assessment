using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events
{
    public class UserDonwgraded : UserEvent
    {
        public UserDonwgraded(User user)
            : base(user)
        {
        }

    }
}
