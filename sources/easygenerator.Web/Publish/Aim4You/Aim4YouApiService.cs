using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Publish.Aim4You.Entities;
using System;
using System.Collections.Generic;

namespace easygenerator.Web.Publish.Aim4You
{
    public class Aim4YouApiService : IAim4YouApiService
    {
        private const string RegisterUserMethodPath = "api/RegisterUser";
        private const string IsUserRegisteredMethodPath = "api/RegisterUser";
        private const string RegisterCourseMethodPath = "api/CourseRegister";
        private const string IsCourseRegisteredMethodPath = "api/CourseRegister";
        private const string UploadCourseMethodPath = "api/CourseUpload";
        private const string DeployCourseMethodPath = "api/CourseDeploy";

        private readonly ConfigurationReader _configurationReader;
        private readonly Aim4YouHttpClient _httpClient;
        private readonly ILog _logger;
        private readonly string _serviceLogin;
        private readonly string _servicePassword;

        public Aim4YouApiService(ConfigurationReader configurationReader, Aim4YouHttpClient httpHelper, ILog logger)
        {
            _configurationReader = configurationReader;
            _httpClient = httpHelper;
            _serviceLogin = _configurationReader.Aim4YouConfiguration.UserName;
            _servicePassword = _configurationReader.Aim4YouConfiguration.Password;
            _logger = logger;
        }

        public bool RegisterUser(string userEmail, string domain)
        {
            return WrapServiceException(() =>
            {
                var methodUrl = GetServiceMethodUrl(RegisterUserMethodPath);
                var responseData = _httpClient.Post<Aim4YouUser>(methodUrl, new { Email = userEmail, UserName = userEmail, Domain = domain }, _serviceLogin, _servicePassword);
                return string.Equals(responseData.Email, userEmail, StringComparison.CurrentCultureIgnoreCase);
            });
        }

        public bool IsUserRegistered(string userEmail, string domain)
        {
            return WrapServiceException(() =>
            {
                var methodUrl = GetServiceMethodUrl(IsUserRegisteredMethodPath);
                var methodParameters = new Dictionary<string, string>();
                methodParameters["userid"] = userEmail;
                methodParameters["domain"] = domain;

                var responseData = _httpClient.Get<string>(methodUrl, methodParameters, _serviceLogin, _servicePassword);
                // according to documentation -1 will be returned if user doesn't exist.
                return !string.Equals(responseData, "-1");
            });
        }

        public Guid? RegisterCourse(string userEmail, Guid courseId, string courseTitle)
        {
            return WrapServiceException<Guid?>(() =>
            {
                var methodUrl = GetServiceMethodUrl(RegisterCourseMethodPath);
                var responseData = _httpClient.Post<Aim4YouCourse>(methodUrl, new { Course = courseTitle, UserName = userEmail, CourseId = courseId }, _serviceLogin, _servicePassword);
                if (responseData.CourseId != Guid.Empty)
                {
                    return responseData.CourseId;
                }
                return null;
            });
        }

        public bool IsCourseRegistered(Guid aim4YouCourseId)
        {
            return WrapServiceException(() =>
            {
                var methodUrl = GetServiceMethodUrl(IsCourseRegisteredMethodPath);
                var methodParameters = new Dictionary<string, string>();
                methodParameters["courseid"] = aim4YouCourseId.ToString();

                var responseData = _httpClient.Get<bool>(methodUrl, methodParameters, _serviceLogin, _servicePassword);
                return responseData;
            });
        }

        public bool UploadCourse(Guid courseId, string courseTitle, byte[] courseBytes)
        {
            return WrapServiceException(() =>
            {
                var methodUrl = GetServiceMethodUrl(UploadCourseMethodPath);
                _httpClient.PostCourseInChunks(methodUrl, courseId.ToString(), courseTitle, courseBytes, _serviceLogin, _servicePassword);
                return true;
            });
        }

        public bool DeployCourse(Guid courseId)
        {
            return WrapServiceException(() =>
            {
                var methodUrl = GetServiceMethodUrl(DeployCourseMethodPath);
                var methodParameters = new Dictionary<string, string>();
                methodParameters["courseid"] = courseId.ToString();

                _httpClient.GetWithNoReply(methodUrl, methodParameters, _serviceLogin, _servicePassword);
                return true;
            });
        }

        private TResult WrapServiceException<TResult>(Func<TResult> action)
        {
            try
            {
                return action();
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                return default(TResult);
            }
        }

        private string GetServiceMethodUrl(string methodPath)
        {
            return string.Format("{0}/{1}", _configurationReader.Aim4YouConfiguration.ServiceUrl, methodPath);
        }
    }
}