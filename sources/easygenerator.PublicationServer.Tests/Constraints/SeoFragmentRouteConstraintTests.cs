using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Routing;
using easygenerator.PublicationServer.Constraints;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.PublicationServer.Tests.Constraints
{
    [TestClass]
    public class SeoFragmentRouteConstraintTests
    {
        private SeoFragmentRouteConstraint _constraint;
        private const string parameterName = "paramName";

        [TestInitialize]
        public void Init()
        {
            _constraint = new SeoFragmentRouteConstraint();
        }

        [TestMethod]
        public void Match_ShouldReturnFalseIfParameterDoesNotExistsInValues()
        {
            //Arrange

            //Act
            var result = _constraint.Match(null, null, parameterName, new Dictionary<string, object>(), HttpRouteDirection.UriGeneration);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Match_ShouldReturnFalseIfValueOfParameterIsNull()
        {
            //Arrange

            //Act
            var result = _constraint.Match(null, null, parameterName, new Dictionary<string, object> { { parameterName, null } }, HttpRouteDirection.UriGeneration);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Match_ShouldReturnFalseIfValueOfParameterIsNotAGuid()
        {
            //Arrange

            //Act
            var result = _constraint.Match(null, null, parameterName, new Dictionary<string, object> { { parameterName, "value" } }, HttpRouteDirection.UriGeneration);

            //Assert
            result.Should().Be(false);
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
    }
}
