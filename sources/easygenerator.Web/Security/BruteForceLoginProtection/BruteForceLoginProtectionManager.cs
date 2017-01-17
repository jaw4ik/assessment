using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Security.BruteForceLoginProtection
{
    public interface IBruteForceLoginProtectionManager
    {
        bool IsRequiredCaptcha(string email, string ip);
        bool IsRequiredCaptchaForEmail(string email);
        bool IsRequiredCaptchaForIP(string ip);
        void StoreFailedAttempt(string email, string ip);
        string GetUrlWithCaptcha(HttpContextBase httpContext, string ip);
    }

    public class BruteForceLoginProtectionManager : IBruteForceLoginProtectionManager
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBruteForceLoginProtectionProvider<LoginInfo> _bruteForceLoginProtectionProvider;
        private readonly IUserLoginInfoRepository _userLoginInfoRepository;
        private readonly IIPLoginInfoRepository _ipLoginInfoRepository;
        private readonly ReCaptchaConfigurationSection _reCaptchaConfiguration;

        public BruteForceLoginProtectionManager(IUnitOfWork unitOfWork, IBruteForceLoginProtectionProvider<LoginInfo> bruteForceLoginProtectionProvider, 
            IUserLoginInfoRepository userLoginInfoRepository, IIPLoginInfoRepository ipLoginInfoRepository, ConfigurationReader configurationReader)
        {
            _unitOfWork = unitOfWork;
            _bruteForceLoginProtectionProvider = bruteForceLoginProtectionProvider;
            _userLoginInfoRepository = userLoginInfoRepository;
            _ipLoginInfoRepository = ipLoginInfoRepository;
            _reCaptchaConfiguration = configurationReader.ReCaptchaConfiguration;
        }
        public bool IsRequiredCaptcha(string email, string ip)
        {
            return IsRequiredCaptchaForEmail(email) || IsRequiredCaptchaForIP(ip);
        }

        public bool IsRequiredCaptchaForIP(string ip)
        {
            if (!_reCaptchaConfiguration.Enabled)
            {
                return false;
            }
            ArgumentValidation.ThrowIfNullOrEmpty(ip, nameof(ip));
            
            var ipLoginInfo = _ipLoginInfoRepository.GetByIP(ip);
            return _bruteForceLoginProtectionProvider.IsRequiredCaptcha(ipLoginInfo);
        }

        public bool IsRequiredCaptchaForEmail(string email)
        {
            if (!_reCaptchaConfiguration.Enabled)
            {
                return false;
            }
            ArgumentValidation.ThrowIfNullOrEmpty(email, nameof(email));

            var userLoginInfo = _userLoginInfoRepository.GetByEmail(email);
            return _bruteForceLoginProtectionProvider.IsRequiredCaptcha(userLoginInfo);
        }

        public void StoreFailedAttempt(string email, string ip)
        {
            if (!_reCaptchaConfiguration.Enabled)
            {
                return;
            }
            ArgumentValidation.ThrowIfNullOrEmpty(email, nameof(email));
            ArgumentValidation.ThrowIfNullOrEmpty(ip, nameof(ip));

            var userLoginInfo = _userLoginInfoRepository.GetByEmail(email);
            var ipLoginInfo = _ipLoginInfoRepository.GetByIP(ip);

            if (ipLoginInfo == null)
            {
                ipLoginInfo = new IPLoginInfo(ip);
                _ipLoginInfoRepository.Add(ipLoginInfo);
            }

            _bruteForceLoginProtectionProvider.StoreFailedAttempt(ipLoginInfo);
            _bruteForceLoginProtectionProvider.StoreFailedAttempt(userLoginInfo);

            _unitOfWork.Save();
        }

        public string GetUrlWithCaptcha(HttpContextBase httpContext, string ip)
        {
            var captchaParam = httpContext.Request.QueryString["captcha"];
            if (!IsRequiredCaptchaForIP(ip) || captchaParam == "true") return null;

            if (!httpContext.Request.QueryString.HasKeys())
            {
                return $"{httpContext.Request.Url}?captcha=true";
            }
            return captchaParam == null ? $"{httpContext.Request.Url}&captcha=true" : httpContext.Request.Url.ToString().Replace("captcha=" + captchaParam, "captcha=true");
        }
    }
}
