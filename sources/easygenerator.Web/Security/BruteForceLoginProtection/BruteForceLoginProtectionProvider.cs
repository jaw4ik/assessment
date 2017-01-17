using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Security.BruteForceLoginProtection
{
    public interface IBruteForceLoginProtectionProvider<in T>
    {
        bool IsRequiredCaptcha(T loginInfo);
        void StoreFailedAttempt(T loginInfo);
    }

    public class BruteForceLoginProtectionProvider<T> : IBruteForceLoginProtectionProvider<T> where T: ILoginInfo
    {
        private readonly ReCaptchaConfigurationSection _reCaptchaConfiguration;
        public BruteForceLoginProtectionProvider(ConfigurationReader configurationReader)
        {
            _reCaptchaConfiguration = configurationReader.ReCaptchaConfiguration;
        }

        public bool IsRequiredCaptcha(T loginInfo)
        {
            if (loginInfo == null)
            {
                return false;
            }
            if (loginInfo.FailedLoginAttemptsCount < _reCaptchaConfiguration.NumberOfFailedAttempts)
            {
                return false;
            }
            return !loginInfo.LastFailTime.HasValue || DateTimeWrapper.Now().Subtract(loginInfo.LastFailTime.Value).TotalHours < _reCaptchaConfiguration.ResetPeriodInHours;
        }

        public void StoreFailedAttempt(T loginInfo)
        {
            if (loginInfo == null)
            {
                return;
            }
            if (loginInfo.LastFailTime.HasValue && DateTimeWrapper.Now().Subtract(loginInfo.LastFailTime.Value).TotalHours >=
                _reCaptchaConfiguration.ResetPeriodInHours)
            {
                loginInfo.ResetFailedLoginInfo();
            }
            loginInfo.StoreFailedLogin();
        }
    }
}
