using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events
{
    public class UserSignedUpEvent
    {
        public User User { get; private set; }
        public string CourseDevelopersCount { get; private set; }
        public string WhenNeedAuthoringTool { get; private set; }
        public string UsedAuthoringTool { get; private set; }

        public UserSignedUpEvent(User user, string courseDevelopersCount, string whenNeedAuthoringTool, string usedAuthoringTool)
        {
            ThrowIfUserIsInvalid(user);

            User = user;
            CourseDevelopersCount = courseDevelopersCount;
            WhenNeedAuthoringTool = whenNeedAuthoringTool;
            UsedAuthoringTool = usedAuthoringTool;
        }

        private void ThrowIfUserIsInvalid(User user)
        {
            ArgumentValidation.ThrowIfNull(user, "user");
        }
    }
}