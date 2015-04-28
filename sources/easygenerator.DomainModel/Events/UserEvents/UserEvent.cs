using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public abstract class UserEvent : Event
    {
        public User User { get; private set; }

        protected UserEvent(User user)
        {
            ThrowIfUserIsInvalid(user);

            User = user;
        }

        private void ThrowIfUserIsInvalid(User user)
        {
            ArgumentValidation.ThrowIfNull(user, "user");
        }
    }
}
