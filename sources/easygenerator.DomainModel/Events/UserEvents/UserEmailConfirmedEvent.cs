using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserEmailConfirmedEvent : UserEvent
    {
        public UserEmailConfirmedEvent(User user) : base(user)
        {
        }
    }
}
