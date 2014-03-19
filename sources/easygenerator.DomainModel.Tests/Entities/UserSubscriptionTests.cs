using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class UserSubscriptionTests
    {
        #region Constructor

        [TestMethod]
        public void UserSubscription_ShouldThrowArgumentException_WhenFreeAccessTypeHaveExpirationTime()
        {
            //Arrange
            Action action = () => UserSubscriptionObjectMother.Create(AccessType.Free, DateTime.MaxValue);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UserSubscription_ShouldCreateUserSubscriptionObject()
        {
            //Arrange
            var accessType = AccessType.Starter;
            var expirationTime = DateTime.MaxValue;

            //Act
            var userSubscription = UserSubscriptionObjectMother.Create(accessType, expirationTime);

            //Assert
            userSubscription.AccessType.Should().Be(accessType);
            userSubscription.ExpirationDate.Should().Be(expirationTime);
        }

        #endregion

        #region Downgrade

        [TestMethod]
        public void DowngradeToFreeAccess_ShouldSetFreeAccessType()
        {
            //Arrange
            var userSubscription = UserSubscriptionObjectMother.Create(AccessType.Starter, DateTime.MaxValue);

            //Act
            userSubscription.Downgrade();

            //Assert
            userSubscription.AccessType.Should().Be(AccessType.Free);
            userSubscription.ExpirationDate.Should().Be(null);
        }

        #endregion

        #region UpdatePlan

        [TestMethod]
        public void UpdatePlan_ShouldSetAccessType()
        {
            //Arrange
            var userSubscription = UserSubscriptionObjectMother.Create();

            //Act
            userSubscription.UpdatePlan(AccessType.Free);

            //Assert
            userSubscription.AccessType.Should().Be(AccessType.Free);
        }

        [TestMethod]
        public void UpdatePlan_ShouldSetAccessTypeWithExpirationDate()
        {
            //Arrange
            var userSubscription = UserSubscriptionObjectMother.Create(AccessType.Free, null);

            //Act
            userSubscription.UpdatePlan(AccessType.Starter, DateTime.MaxValue);

            //Assert
            userSubscription.AccessType.Should().Be(AccessType.Starter);
            userSubscription.ExpirationDate.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void UpdatePlan_ShouldThrowArgumentException_WhenFreeAccessTypeHaveExpirationTime()
        {
            //Arrange
            var userSubscription = UserSubscriptionObjectMother.Create(AccessType.Starter, DateTime.MaxValue);
            Action action = () => userSubscription.UpdatePlan(AccessType.Free, DateTime.MaxValue);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpdatePlan_ShouldThrowArgumentException_WhenExpirationDateIsLessThanMinimal()
        {
            //Arrange
            var userSubscription = UserSubscriptionObjectMother.Create(AccessType.Starter, DateTime.MaxValue);
            Action action = () => userSubscription.UpdatePlan(AccessType.Starter, DateTime.MinValue);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpdatePlan_ShouldThrowArgumentException_WhenAccessTypeHasInvalidValue()
        {
            //Arrange
            var userSubscription = UserSubscriptionObjectMother.Create(AccessType.Starter, DateTime.MaxValue);
            Action action = () => userSubscription.UpdatePlan((AccessType)100500, DateTime.MaxValue);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("plan");
        }

        #endregion
    }
}
