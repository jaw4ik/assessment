using System;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class UserLoginInfoObjectMother
    {
        private const string _email = "login@info.com";
        private const int _failedLoginAttemptsCount = 0;

        public static UserLoginInfo Create(User user = null, int failedLoginAttemptsCount = _failedLoginAttemptsCount, DateTime? lastFailTime = null)
        {
            return new UserLoginInfo(user ?? UserObjectMother.CreateWithEmail(_email), failedLoginAttemptsCount, lastFailTime);
        }
    }
}
