using System;
using System.Collections.Generic;
using System.Linq;

using System.Text;
using System.Threading.Tasks;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;

namespace easygenerator.Web.Tests.Components
{
    [TestClass]
    public class BranchTrackProviderTests
    {
        private const string BranchTrackServiceUrl = "service/url";
        private const string BranchTrackApiKey = "api_key";

        private BranchTrackProvider _branchtrackProvider;

        private HttpClient _httpClient;
        private ConfigurationReader _configurationReader;

        [TestInitialize]
        public void InitializeContext()
        {
            _httpClient = Substitute.For<HttpClient>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _branchtrackProvider = new BranchTrackProvider(_httpClient, _configurationReader);

            var _branchTrackConfiguration = new BranchTrackConfigurationSection() { ServiceUrl = BranchTrackServiceUrl, ApiKey = BranchTrackApiKey };
            _configurationReader.BranchTrackConfiguration.Returns(_branchTrackConfiguration);
        }

        #region GetDashboardInfo

        [TestMethod]
        public void GetDashboardInfo_ShouldCallHttpClientGetMethod()
        {
            var userId = Guid.NewGuid().ToNString();
            var requestUrl = BranchTrackServiceUrl + "/api/1/clients/" + userId + "/request_url";

            _branchtrackProvider.GetDashboardInfo(userId);

            _httpClient.Received().Get<object>(Arg.Is(requestUrl), Arg.Any<Dictionary<string, string>>(), Arg.Any<Dictionary<string, string>>());
        }

        [TestMethod]
        public void GetDashboardInfo_ShouldReturnResponse()
        {
            var userId = Guid.NewGuid().ToNString();
            var expectedResult = new { someProperty = "some_value" };
            _httpClient.Get<object>(Arg.Any<string>(), Arg.Any<Dictionary<string, string>>(),
                Arg.Any<Dictionary<string, string>>()).ReturnsForAnyArgs(expectedResult);

            var result = _branchtrackProvider.GetDashboardInfo(userId);

            result.ShouldBeSimilar(expectedResult);
        }

        #endregion

        #region GetProjectInfo

        [TestMethod]
        public void GetProjectInfo_ShouldCallHttpClientGetMethod()
        {
            var projectId = Guid.NewGuid().ToNString();
            var requestUrl = BranchTrackServiceUrl + "/api/1/projects/" + projectId + ".json";

            _branchtrackProvider.GetProjectInfo(projectId);

            _httpClient.Received().Get<object>(Arg.Is(requestUrl), Arg.Any<Dictionary<string, string>>(), Arg.Any<Dictionary<string, string>>());
        }

        [TestMethod]
        public void GetProjectInfo_ShouldReturnResponse()
        {
            var projectId = Guid.NewGuid().ToNString();
            var expectedResult = new { someProperty = "some_value" };
            _httpClient.Get<object>(Arg.Any<string>(), Arg.Any<Dictionary<string, string>>(),
                Arg.Any<Dictionary<string, string>>()).ReturnsForAnyArgs(expectedResult);

            var result = _branchtrackProvider.GetProjectInfo(projectId);

            result.ShouldBeSimilar(expectedResult);
        }

        #endregion

        #region GetProjectEditingInfo

        [TestMethod]
        public void GetProjectEditingInfo_ShouldCallHttpClientGetMethod()
        {
            var userId = Guid.NewGuid().ToNString();
            var projectId = Guid.NewGuid().ToNString();
            var requestUrl = BranchTrackServiceUrl + "/api/1/clients/" + userId + "/request_url?project_id=" + projectId;

            _branchtrackProvider.GetProjectEditingInfo(userId, projectId);

            _httpClient.Received().Get<object>(Arg.Is(requestUrl), Arg.Any<Dictionary<string, string>>(), Arg.Any<Dictionary<string, string>>());
        }

        [TestMethod]
        public void GetProjectEditingInfo_ShouldReturnResponse()
        {
            var userId = Guid.NewGuid().ToNString();
            var projectId = Guid.NewGuid().ToNString();
            var expectedResult = new { someProperty = "some_value" };
            _httpClient.Get<object>(Arg.Any<string>(), Arg.Any<Dictionary<string, string>>(),
                Arg.Any<Dictionary<string, string>>()).ReturnsForAnyArgs(expectedResult);

            var result = _branchtrackProvider.GetProjectEditingInfo(userId, projectId);

            result.ShouldBeSimilar(expectedResult);
        }

        [TestMethod]
        public void GetProjectEditingInfo_ShouldReturnNull_WhenHttpClientThrowAnException()
        {
            var userId = Guid.NewGuid().ToNString();
            var projectId = Guid.NewGuid().ToNString();
            _httpClient.Get<object>(Arg.Any<string>(), Arg.Any<Dictionary<string, string>>(),
                Arg.Any<Dictionary<string, string>>()).Returns(x => { throw new Exception(); });

            var result = _branchtrackProvider.GetProjectEditingInfo(userId, projectId);

            result.Should().BeNull();
        }

        #endregion
    }
}
