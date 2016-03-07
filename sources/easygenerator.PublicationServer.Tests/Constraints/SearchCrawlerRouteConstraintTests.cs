using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http.Routing;
using easygenerator.PublicationServer.Constraints;
using easygenerator.PublicationServer.Search;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.PublicationServer.Tests.Constraints
{
    [TestClass]
    public class SearchCrawlerRouteConstraintTests
    {
        private SearchCrawlerRouteConstraint _constraint;
        private SearchCrawlerDetector _searchCrawlerDetector;
        private const string ParameterName = "paramName";

        [TestInitialize]
        public void Init()
        {
            _searchCrawlerDetector = Substitute.For<SearchCrawlerDetector>();
            _constraint = new SearchCrawlerRouteConstraint(_searchCrawlerDetector);
        }

        [TestMethod]
        public void Match_ShouldReturnFalseIfSearchCrawlerDetectorReturnsFalse()
        {
            var message = new HttpRequestMessage(HttpMethod.Get, "http://example.com");
            _searchCrawlerDetector.IsCrawler(Arg.Any<string>()).Returns(false);
            var result = _constraint.Match(message, null, ParameterName, new Dictionary<string, object> { { ParameterName, Guid.NewGuid() } }, HttpRouteDirection.UriGeneration);
            result.Should().Be(false);
        }

        [TestMethod]
        public void Match_ShouldReturnTrueIfSearchCrawlerDetectorReturnsTrue()
        {
            var message = new HttpRequestMessage(HttpMethod.Get, "http://example.com");
            _searchCrawlerDetector.IsCrawler(Arg.Any<string>()).Returns(true);
            var result = _constraint.Match(message, null, ParameterName, new Dictionary<string, object> { { ParameterName, Guid.NewGuid() } }, HttpRouteDirection.UriGeneration);
            result.Should().Be(true);
        }
    }
}
