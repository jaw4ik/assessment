using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserSignedUpEvent : UserEvent
    {
        public string UserPassword { get; private set; }

        public UserSignedUpEvent(User user, string userPassword)
            : base(user)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(userPassword, "userPassword");

            UserPassword = userPassword;
        }
    }
}