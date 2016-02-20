using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class LtiUserInfoObjectMother
    {
        private const string LtiUserId = "132";

        public static LtiUserInfo Create(string ltiUserId = LtiUserId,
            ConsumerTool consumerTool = null, User user = null)
        {
            return new LtiUserInfo(ltiUserId, consumerTool ?? new ConsumerTool(), user ?? UserObjectMother.CreateWithEmail("email@mail.ua"));
        }
    }
}
