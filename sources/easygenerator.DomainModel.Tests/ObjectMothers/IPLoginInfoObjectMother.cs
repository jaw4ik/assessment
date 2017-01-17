using System;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class IPLoginInfoObjectMother
    {
        private const string _ip = "127.0.0.1";
        private const int _failedLoginAttemptsCount = 0;

        public static IPLoginInfo Create(string ip = _ip, int failedLoginAttemptsCount = _failedLoginAttemptsCount, DateTime? lastFailTime = null)
        {
            return new IPLoginInfo(ip, failedLoginAttemptsCount, lastFailTime);
        }
    }
}
