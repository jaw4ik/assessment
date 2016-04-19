using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.ApiKeys;
using easygenerator.Web.Extensions;
using HttpClient = easygenerator.Infrastructure.Http.HttpClient;

namespace easygenerator.Web.Components
{
    public class BranchTrackProvider
    {
        private readonly HttpClient _httpClient;
        private readonly ConfigurationReader _configurationReader;

        private const string GetDashboardApiUrl = "/api/1/clients/{userId}/request_url";
        private const string GetProjectInfoApiUrl = "/api/1/projects/{projectId}.json";
        private const string GetProjectEditingInfoApiUrl = "/api/1/clients/{userId}/request_url?project_id={projectId}";

        private const string ApiKeyDefault = "Default";
        private const string ApiKeyAcademyBT = "AcademyBT";

        public BranchTrackProvider(HttpClient httpClient, ConfigurationReader configurationReader)
        {
            _httpClient = httpClient;
            _configurationReader = configurationReader;
        }

        public virtual object GetDashboardInfo(string userId, AccessType accessType)
        {
            var getDashboardApiUrl = _configurationReader.BranchTrackConfiguration.ServiceUrl + GetDashboardApiUrl.Replace("{userId}", userId);

            return _httpClient.Get<object>(getDashboardApiUrl, null, GetRequestHeaders(accessType));
        }

        public virtual object GetProjectInfo(string projectId, AccessType accessType)
        {
            var getProjectInfoApiUrl = _configurationReader.BranchTrackConfiguration.ServiceUrl + GetProjectInfoApiUrl.Replace("{projectId}", projectId);

            return _httpClient.Get<object>(getProjectInfoApiUrl, null, GetRequestHeaders(accessType));
        }

        public virtual object GetProjectEditingInfo(string userId, string projectId, AccessType accessType)
        {
            try
            {
                var getProjectEditingInfoApiUrl = _configurationReader.BranchTrackConfiguration.ServiceUrl + GetProjectEditingInfoApiUrl.Replace("{userId}", userId).Replace("{projectId}", projectId);

                return _httpClient.Get<object>(getProjectEditingInfoApiUrl, null, GetRequestHeaders(accessType));
            }
            catch
            {
                return null;
            }
        }

        private Dictionary<string, string> GetRequestHeaders(AccessType accessType)
        {
            var key = (accessType == AccessType.AcademyBT) ? ApiKeyAcademyBT : ApiKeyDefault;
            var apiKey = (from ApiKeyElement e in _configurationReader.BranchTrackConfiguration.ApiKeys
                          where e.Name == key
                          select e)
                          .SingleOrDefault();

            return apiKey == null ? new Dictionary<string, string>() : new Dictionary<string, string>() { { "X-BranchTrack-App-Token", apiKey.Value } };
        }
    }
}