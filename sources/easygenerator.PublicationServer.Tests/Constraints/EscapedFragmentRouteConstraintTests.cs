using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http.Routing;
using easygenerator.PublicationServer.Constraints;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.PublicationServer.Tests.Constraints
{
    [TestClass]
    public class EscapedFragmentRouteConstraintTests
    {
        private EscapedFragmentRouteConstraint _constraint;
        private const string parameterName = "paramName";

        [TestInitialize]
        public void Init()
        {
            _constraint = new EscapedFragmentRouteConstraint();
        }

        [TestMethod]
        public void Match_ShouldReturnFalseIfQueryParamsAreNull()
        {
            var message = new HttpRequestMessage(HttpMethod.Get, "http://example.com");
            var result = _constraint.Match(message, null, parameterName, new Dictionary<string, object> { { parameterName, Guid.NewGuid() } }, HttpRouteDirection.UriGeneration);
            result.Should().Be(false);
        }

        [TestMethod]
        public void Match_ShouldReturnFalseIfQueryParamsDoesNotContainSeoFragment()
        {
            var message = new HttpRequestMessage(HttpMethod.Get, "http://example.com?a=1");
            var result = _constraint.Match(message, null, parameterName, new Dictionary<string, object> { { parameterName, Guid.NewGuid() } }, HttpRouteDirection.UriGeneration);
            result.Should().Be(false);
        }

        [TestMethod]
        public void Match_ShouldReturnTrueIfQueryParamsContainsSeoFragment()
        {
            var message = new HttpRequestMessage(HttpMethod.Get, "http://example.com?_escaped_fragment_=");
            var result = _constraint.Match(message, null, parameterName, new Dictionary<string, object> { { parameterName, Guid.NewGuid() } }, HttpRouteDirection.UriGeneration);
            result.Should().Be(true);
        }

        [TestMethod]
        public void Match_ShouldReturnTrueIfRefererContainsSeoFragment()
        {
            var message = new HttpRequestMessage(HttpMethod.Get, "http://example.com/script.js");
            message.Headers.Referrer = new Uri("http://example.com?_escaped_fragment_=");
            var result = _constraint.Match(message, null, parameterName, new Dictionary<string, object> { { parameterName, Guid.NewGuid() } }, HttpRouteDirection.UriGeneration);
            result.Should().Be(true);
        }
    }
}
