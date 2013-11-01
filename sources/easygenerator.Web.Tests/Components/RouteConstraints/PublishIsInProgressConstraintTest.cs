using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Routing;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Components.RouteConstraints;
using easygenerator.Web.Publish;
using NSubstitute;

namespace easygenerator.Web.Tests.Components.RouteConstraints
{
    [TestClass]
    public class PublishIsInProgressConstraintTest
    {
        private PublishIsInProgressConstraint _constraint;
        private IPublishDispatcher _publishDispatcher;
        private const string parameterValue = "someValue";
        private const string parameterName = "paramName";

        [TestInitialize]
        public void InitializeConstraint()
        {
            _publishDispatcher = Substitute.For<IPublishDispatcher>();
            _constraint = new PublishIsInProgressConstraint(_publishDispatcher);
        }

        #region Match

        [TestMethod]
        public void Match_ShouldReturnFalseIfParameterDoesNotExistsInValues()
        {
            //Arrange

            //Act
            var result = _constraint.Match(null, null, parameterName, new RouteValueDictionary() { }, RouteDirection.IncomingRequest);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Match_ShouldReturnFalseIfValueOfParameterIsNull()
        {
            //Arrange

            //Act
            var result = _constraint.Match(null, null, parameterName, new RouteValueDictionary { { parameterName, null } }, RouteDirection.IncomingRequest);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Match_ShouldCallIsPublishingDispatcherMethodWithValueFromRouteDictionary_IfValueExistsAndNotNull()
        {
            //Arrange

            //Act
            _constraint.Match(null, null, parameterName, new RouteValueDictionary { { parameterName, parameterValue } }, RouteDirection.IncomingRequest);
            
            //Assert
            _publishDispatcher.Received().IsPublishing(parameterValue);
        }

        [TestMethod]
        public void Match_ShouldReturnFalseWhenDispatcherIsPublishingReturnsFalse()
        {
            //Arrange
            _publishDispatcher.IsPublishing(Arg.Any<string>()).Returns(false);

            //Act
            var result = _constraint.Match(null, null, parameterName, new RouteValueDictionary { { parameterName, parameterValue } }, RouteDirection.IncomingRequest);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Match_ShouldReturnTrueWhenDispatcherIsPublishingReturnsTrue()
        {
            //Arrange
            _publishDispatcher.IsPublishing(Arg.Any<string>()).Returns(true);

            //Act
            var result = _constraint.Match(null, null, parameterName, new RouteValueDictionary { { parameterName, parameterValue } }, RouteDirection.IncomingRequest);

            //Assert
            result.Should().Be(true);
        }

        #endregion
    }
}
