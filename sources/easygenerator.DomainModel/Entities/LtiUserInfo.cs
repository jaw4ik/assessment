using System;

namespace easygenerator.DomainModel.Entities
{
    public class LtiUserInfo
    {
        public Guid Id { get; set; }
        public string LtiUserId { get; private set; }

        public virtual void UpdateLtiUserId(string ltiUserId)
        {
            LtiUserId = ltiUserId;
        }

        public User User { get; set; }
    }
}
