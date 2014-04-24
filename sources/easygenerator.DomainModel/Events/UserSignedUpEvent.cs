using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events
{
    public class UserSignedUpEvent
    {
        public User User { get; private set; }
        public string UserPassword { get; private set; }
        public string CourseDevelopersCount { get; private set; }
        public bool RequestIntroductionDemo { get; private set; }

        public UserSignedUpEvent(User user, string userPassword, string courseDevelopersCount, bool requestIntroductionDemo)
        {
            ThrowIfUserIsInvalid(user);
            ArgumentValidation.ThrowIfNullOrEmpty(userPassword, "userPassword");

            User = user;
            UserPassword = userPassword;
            CourseDevelopersCount = courseDevelopersCount;
            RequestIntroductionDemo = requestIntroductionDemo;
        }

        private void ThrowIfUserIsInvalid(User user)
        {
            ArgumentValidation.ThrowIfNull(user, "user");
        }
    }
}