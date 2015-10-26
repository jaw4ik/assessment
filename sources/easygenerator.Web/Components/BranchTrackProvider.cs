using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using easygenerator.Web.Components.Configuration;
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

        public BranchTrackProvider(HttpClient httpClient, ConfigurationReader configurationReader)
        {
            _httpClient = httpClient;
            _configurationReader = configurationReader;
        }

        public virtual object GetDashboardInfo(string userId)
        {
            var getDashboardApiUrl = _configurationReader.BranchTrackConfiguration.ServiceUrl + GetDashboardApiUrl.Replace("{userId}", userId);

            return _httpClient.Get<object>(getDashboardApiUrl, null, GetRequestHeaders());
        }

        public virtual object GetProjectInfo(string projectId)
        {
            var getProjectInfoApiUrl = _configurationReader.BranchTrackConfiguration.ServiceUrl + GetProjectInfoApiUrl.Replace("{projectId}", projectId);

            return _httpClient.Get<object>(getProjectInfoApiUrl, null, GetRequestHeaders());
        }

        public virtual object GetProjectEditingInfo(string userId, string projectId)
        {
            try
            {
                var getProjectEditingInfoApiUrl = _configurationReader.BranchTrackConfiguration.ServiceUrl + GetProjectEditingInfoApiUrl.Replace("{userId}", userId).Replace("{projectId}", projectId);

                return _httpClient.Get<object>(getProjectEditingInfoApiUrl, null, GetRequestHeaders());
            }
            catch
            {
                return null;
            }
        }

        private Dictionary<string, string> GetRequestHeaders()
        {
            return new Dictionary<string, string>() { { "X-BranchTrack-App-Token", _configurationReader.BranchTrackConfiguration.ApiKey } };
        }
    }
}