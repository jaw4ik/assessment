using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserEmailConfirmedEvent : UserEvent
    {
        public UserEmailConfirmedEvent(User user) : base(user)
        {
        }
    }
}
