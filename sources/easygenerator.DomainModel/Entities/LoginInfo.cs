using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public interface ILoginInfo
    {
        int FailedLoginAttemptsCount { get; }
        DateTime? LastFailTime { get; }
        void StoreFailedLogin();
        void ResetFailedLoginInfo();
    }

    public abstract class LoginInfo : Identifiable, ILoginInfo
    {
        private const int FailedLoginCounterMaxValue = 1000000;
        protected LoginInfo()
        {
        }
        protected LoginInfo(int failedLoginAttemptsCount, DateTime? lastFailTime)
        {
            SetLoginInfo(failedLoginAttemptsCount, lastFailTime);
        }
        protected LoginInfo(Guid id, int failedLoginAttemptsCount, DateTime? lastFailTime) : base(id)
        {
            SetLoginInfo(failedLoginAttemptsCount, lastFailTime);
        }

        public int FailedLoginAttemptsCount { get; protected internal set; }
        public DateTime? LastFailTime { get; protected internal set; }

        public void StoreFailedLogin()
        {
            // If number of failed attempts is to large, stop incrementing it to avoid SQL limits
            if (FailedLoginAttemptsCount < FailedLoginCounterMaxValue)
            {
                FailedLoginAttemptsCount++;
            }
            LastFailTime = DateTimeWrapper.Now();
        }

        public void ResetFailedLoginInfo()
        {
            FailedLoginAttemptsCount = 0;
            LastFailTime = null;
        }

        private void SetLoginInfo(int failedLoginAttemptsCount, DateTime? lastFailTime)
        {
            FailedLoginAttemptsCount = failedLoginAttemptsCount;
            LastFailTime = lastFailTime;
        }
    }
}
