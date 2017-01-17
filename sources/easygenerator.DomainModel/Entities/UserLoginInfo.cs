using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class UserLoginInfo : LoginInfo
    {
        public UserLoginInfo()
        {
        }

        public UserLoginInfo(User user, int failedLoginAttemptsCount = 0, DateTime? lastFailTime = null) : base(user.Id, failedLoginAttemptsCount, lastFailTime)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(user.Email, "email");
            Email = user.Email;
            User = user;
        }
        public string Email { get; protected internal set; }
        public virtual User User { get; set; }
    }
}
