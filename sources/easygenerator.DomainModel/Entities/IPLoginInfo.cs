using easygenerator.Infrastructure;
using System;

namespace easygenerator.DomainModel.Entities
{
    public class IPLoginInfo : LoginInfo
    {
        public IPLoginInfo()
        {
        }

        public IPLoginInfo(string ip, int failedLoginAttemptsCount = 0, DateTime? lastFailTime = null) : base(failedLoginAttemptsCount, lastFailTime)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(ip, nameof(ip));
            IP = ip;
        }

        public string IP { get; protected internal set; }
    }
}
