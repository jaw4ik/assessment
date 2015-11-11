using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class LtiUserInfo
    {
        public Guid Id { get; private set; }
        public string LtiUserId { get; private set; }

        public virtual void UpdateLtiUserId(string ltiUserId)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(ltiUserId, "ltiUserId");
            LtiUserId = ltiUserId;
        }

        public User User { get; private set; }
    }
}
