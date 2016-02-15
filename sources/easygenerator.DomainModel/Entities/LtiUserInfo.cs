using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class LtiUserInfo : Identifiable
    {
        protected internal LtiUserInfo() { }

        protected internal LtiUserInfo(string ltiUserId, ConsumerTool consumerTool, User user)
        {
            ArgumentValidation.ThrowIfNull(consumerTool, nameof(consumerTool));
            ArgumentValidation.ThrowIfNull(user, nameof(user));

            LtiUserId = ltiUserId;
            ConsumerTool = consumerTool;
            ConsumerTool_Id = consumerTool.Id;
            User = user;
            User_Id = user.Id;
        }

        public string LtiUserId { get; private set; }
        public Guid User_Id { get; private set; }
        public Guid ConsumerTool_Id { get; private set; }
        public virtual User User { get; private set; }
        public virtual ConsumerTool ConsumerTool { get; private set; }
    }
}
