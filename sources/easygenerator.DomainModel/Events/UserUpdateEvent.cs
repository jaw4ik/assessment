using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events
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
