using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserUpdateEvent : UserEvent
    {
        public string UserPassword { get; private set; }

        public UserUpdateEvent(User user, string userPassword) : base(user)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(userPassword, "userPassword");
            UserPassword = userPassword;
        }
    }
}
