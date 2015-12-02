using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserSignedUpEvent : UserEvent
    {
        public string UserPassword { get; private set; }
        public string UserRole { get; private set; }

        public UserSignedUpEvent(User user, string userPassword, string userRole = null)
            : base(user)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(userPassword, "userPassword");

            UserPassword = userPassword;
            UserRole = userRole;
        }
    }
}