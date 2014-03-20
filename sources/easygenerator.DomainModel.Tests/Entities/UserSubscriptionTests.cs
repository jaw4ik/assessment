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

        #region UpgradeToStarter

        [TestMethod]
        public void UpgradeToStarter_ShouldThrowArgumentException_WhenExpirationDateIsLessThanMinimal()
        {
            //Arrange
            var userSubscription = UserSubscriptionObjectMother.Create(AccessType.Starter, DateTime.MaxValue);
            Action action = () => userSubscription.UpgradeToStarter(DateTime.MinValue);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpgradeToStarter_ShouldSetFreeAccessType()
        {
            //Arrange
            var userSubscription = UserSubscriptionObjectMother.Create(AccessType.Free);

            //Act
            userSubscription.UpgradeToStarter(DateTime.MaxValue);

            //Assert
            userSubscription.AccessType.Should().Be(AccessType.Starter);
        }

        [TestMethod]
        public void UpgradeToStarter_ShouldSetExpirationDate()
        {
            //Arrange
            var userSubscription = UserSubscriptionObjectMother.Create(AccessType.Free);

            //Act
            userSubscription.UpgradeToStarter(DateTime.MaxValue);

            //Assert
            userSubscription.ExpirationDate.Should().Be(DateTime.MaxValue);
        }

        #endregion
    }
}
