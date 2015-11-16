using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class LtiUserInfo : Identifiable
    {
        protected internal LtiUserInfo() { }

        protected internal LtiUserInfo(string ltiUserId, ConsumerTool consumerTool)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(ltiUserId, nameof(ltiUserId));
            ArgumentValidation.ThrowIfNull(consumerTool, nameof(consumerTool));

            LtiUserId = ltiUserId;
            ConsumerTool = consumerTool;
        }

        public string LtiUserId { get; private set; }
        public User User { get; private set; }
        public ConsumerTool ConsumerTool { get; private set; }
    }
}
