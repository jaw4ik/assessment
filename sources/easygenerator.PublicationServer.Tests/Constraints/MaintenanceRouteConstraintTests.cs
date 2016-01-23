using System;
using System.Web.Http.Routing;
using easygenerator.PublicationServer.Constraints;
using easygenerator.PublicationServer.Publish;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;

namespace easygenerator.PublicationServer.Tests.Constraints
{
    [TestClass]
    public class MaintenanceRouteConstraintTests
    {
        private MaintenanceRouteConstraint _constraint;
        private IPublishDispatcher _publishDispatcher;
        private Guid parameterValue = Guid.NewGuid();
        private const string parameterName = "paramName";

        [TestInitialize]
        public void InitializeConstraint()
        {
            _publishDispatcher = Substitute.For<IPublishDispatcher>();
            _constraint = new MaintenanceRouteConstraint(_publishDispatcher);
        }
     
        #region Match

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
        public void Match_ShouldCallIsPublishingDispatcherMethodWithValueFromRouteDictionary_IfValueExistsAndNotNull()
        {
            //Arrange

            //Act
            _constraint.Match(null, null, parameterName, new Dictionary<string, object> { { parameterName, parameterValue } }, HttpRouteDirection.UriGeneration);

            //Assert
            _publishDispatcher.Received().IsPublishing(parameterValue);
        }

        [TestMethod]
        public void Match_ShouldReturnFalseWhenDispatcherIsPublishingReturnsFalse()
        {
            //Arrange
            _publishDispatcher.IsPublishing(Arg.Any<Guid>()).Returns(false);

            //Act
            var result = _constraint.Match(null, null, parameterName, new Dictionary<string, object> { { parameterName, parameterValue } }, HttpRouteDirection.UriGeneration);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Match_ShouldReturnTrueWhenDispatcherIsPublishingReturnsTrue()
        {
            //Arrange
            _publishDispatcher.IsPublishing(Arg.Any<Guid>()).Returns(true);

            //Act
            var result = _constraint.Match(null, null, parameterName, new Dictionary<string, object> { { parameterName, parameterValue } }, HttpRouteDirection.UriGeneration);

            //Assert
            result.Should().Be(true);
        }

        #endregion
    }
}
