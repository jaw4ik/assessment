using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class UserSignedUpEvent : UserEvent
    {
        public string UserPassword { get; private set; }
        public string CourseDevelopersCount { get; private set; }
        public bool RequestIntroductionDemo { get; private set; }

        public UserSignedUpEvent(User user, string userPassword, string courseDevelopersCount, bool requestIntroductionDemo) : base(user)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(userPassword, "userPassword");

            UserPassword = userPassword;
            CourseDevelopersCount = courseDevelopersCount;
            RequestIntroductionDemo = requestIntroductionDemo;
        }
    }
}