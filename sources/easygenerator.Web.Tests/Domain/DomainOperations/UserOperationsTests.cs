using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Domain.DomainOperations;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.Web.Tests.Domain.DomainOperations
{
    [TestClass]
    public class UserOperationsTests
    {
        private IUserOperations _userOperations;

        [TestInitialize]
        public void Initialize()
        {
            _userOperations = new UserOperations();
        }

        #region ApplyOrganizationSettingsSubscription

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldNotUpdateUserSubscription_WhenUserSubscriptionIsActual()
        {
            //Arrange
            var user = Substitute.For<User>();
            var accessType = AccessType.Trial;
            var expirationDate = DateTime.MinValue;
            var subscription = new UserSubscription(accessType, expirationDate);
            user.AccessType.Returns(accessType);
            user.ExpirationDate.Returns(expirationDate);

            //Act
            _userOperations.ApplyOrganizationSettingsSubscription(user, subscription);

            //Assert
            AssertUserSubscriptionWasNotUpdated(user);
        }

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsFree()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettingsSubscription(AccessType.Free);
        }

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsTrial()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettingsSubscription(AccessType.Trial);
        }

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsAcademy()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettingsSubscription(AccessType.Academy);
        }

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsAcademyBT()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettingsSubscription(AccessType.AcademyBT);
        }

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsPlus()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettingsSubscription(AccessType.Plus);
        }

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsStarter()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettingsSubscription(AccessType.Starter);
        }

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldSetUserPersonalSubscription_WhenUserPersonalSubscriptionIsNotDefined()
        {
            //Arrange
            var user = Substitute.For<User>();
            var userSettings = Substitute.For<UserSettings>();
            user.Settings.Returns(userSettings);
            var accessType = AccessType.Starter;
            var expirationDate = DateTime.MinValue;
            user.AccessType.Returns(accessType);
            user.ExpirationDate.Returns(expirationDate);

            userSettings.GetPersonalSubscription().Returns(null as UserSubscription);

            //Act
            _userOperations.ApplyOrganizationSettingsSubscription(user, new UserSubscription(AccessType.Academy, DateTime.MaxValue));

            //Assert
            userSettings.Received().UpdatePersonalSubscription(accessType, expirationDate);
        }

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldSetUserPersonalSubscription_WithMinExpirationDate_WhenUserPersonalSubscriptionIsNotDefined_AndUserExpirationDateIsNull()
        {
            //Arrange
            var user = Substitute.For<User>();
            var userSettings = Substitute.For<UserSettings>();
            user.Settings.Returns(userSettings);
            var accessType = AccessType.Starter;
            user.AccessType.Returns(accessType);
            user.ExpirationDate.Returns(null as DateTime?);

            userSettings.GetPersonalSubscription().Returns(null as UserSubscription);

            //Act
            _userOperations.ApplyOrganizationSettingsSubscription(user, new UserSubscription(AccessType.Academy, DateTime.MaxValue));

            //Assert
            userSettings.Received().UpdatePersonalSubscription(accessType, DateTimeWrapper.MinValue());
        }

        [TestMethod]
        public void ApplyOrganizationSettingsSubscription_ShouldNotUpdatetUserPersonalSubscription_WhenUserPersonalSubscriptionIsDefinedAlready()
        {
            //Arrange
            var user = Substitute.For<User>();
            var userSettings = Substitute.For<UserSettings>();
            user.Settings.Returns(userSettings);
            var accessType = AccessType.Starter;
            var expirationDate = DateTime.MinValue;
            user.AccessType.Returns(accessType);
            user.ExpirationDate.Returns(expirationDate);

            userSettings.GetPersonalSubscription().Returns(new UserSubscription(AccessType.AcademyBT, DateTime.MaxValue));

            //Act
            _userOperations.ApplyOrganizationSettingsSubscription(user, new UserSubscription(AccessType.Academy, DateTime.MaxValue));

            //Assert
            userSettings.DidNotReceive().UpdatePersonalSubscription(Arg.Any<AccessType>(), Arg.Any<DateTime>());
        }

        #endregion

        #region DiscardOrganizationSettingsSubscription

        [TestMethod]
        public void DiscardOrganizationSettingsSubscription_ShouldNotUpdateUserSubscriotion_WhenUserSettingsPersonalSubscriptionIsNotDefined()
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<UserSettings>();
            user.Settings.Returns(settings);
            settings.GetPersonalSubscription().Returns(null as UserSubscription);

            //Act
            _userOperations.DiscardOrganizationSettingsSubscription(user);

            //Assert
            AssertUserSubscriptionWasNotUpdated(user);
        }

        [TestMethod]
        public void DiscardOrganizationSettingsSubscription_ShouldNotResetUserSettingsPersonalSubscription_WhenUserSettingsPersonalSubscriptionIsNotDefined()
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<UserSettings>();
            user.Settings.Returns(settings);
            settings.GetPersonalSubscription().Returns(null as UserSubscription);

            //Act
            _userOperations.DiscardOrganizationSettingsSubscription(user);

            //Assert
            settings.DidNotReceive().ResetPersonalSubscription();
        }

        [TestMethod]
        public void DiscardOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsFree()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettingsSubscription(AccessType.Free);
        }

        [TestMethod]
        public void DiscardOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsTrial()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettingsSubscription(AccessType.Trial);
        }

        [TestMethod]
        public void DiscardOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsAcademy()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettingsSubscription(AccessType.Academy);
        }

        [TestMethod]
        public void DiscardOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsAcademyBT()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettingsSubscription(AccessType.AcademyBT);
        }

        [TestMethod]
        public void DiscardOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsPlus()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettingsSubscription(AccessType.Plus);
        }

        [TestMethod]
        public void DiscardOrganizationSettingsSubscription_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsStarter()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettingsSubscription(AccessType.Starter);
        }


        [TestMethod]
        public void DiscardOrganizationSettingsSubscription_ShouldResetUserSettingsPersonalSubscription()
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<UserSettings>();
            user.Settings.Returns(settings);
            settings.GetPersonalSubscription().Returns(new UserSubscription(AccessType.Free, DateTime.MinValue));

            //Act
            _userOperations.DiscardOrganizationSettingsSubscription(user);

            //Assert
            settings.Received().ResetPersonalSubscription();
        }

        #endregion

        #region Helper methods

        private void AssertUserSubscriptionUpdatedOnApplyOrganizationSettingsSubscription(AccessType accessType)
        {
            //Arrange
            var user = Substitute.For<User>();
            user.Settings.Returns(Substitute.For<UserSettings>());
            var expirationDate = DateTime.MinValue;

            //Act
            _userOperations.ApplyOrganizationSettingsSubscription(user, new UserSubscription(accessType, expirationDate));

            //Assert
            AssertUserSubscriptionUpdated(user, accessType, expirationDate);
        }

        private void AssertUserSubscriptionUpdatedOnDiscardOrganizationSettingsSubscription(AccessType accessType)
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<UserSettings>();
            user.Settings.Returns(settings);
            var expirationDate = DateTime.MinValue;
            settings.GetPersonalSubscription().Returns(new UserSubscription(accessType, expirationDate));

            //Act
            _userOperations.DiscardOrganizationSettingsSubscription(user);

            //Assert
            AssertUserSubscriptionUpdated(user, accessType, expirationDate);
        }

        private void AssertUserSubscriptionUpdated(User user, AccessType accessType, DateTime expirationDate)
        {
            switch (accessType)
            {
                case AccessType.Free:
                    user.Received().DowngradePlanToFree();
                    break;
                case AccessType.Academy:
                    user.Received().UpgradePlanToAcademy(expirationDate);
                    break;
                case AccessType.AcademyBT:
                    user.Received().UpgradePlanToAcademyBT(expirationDate);
                    break;
                case AccessType.Plus:
                    user.Received().UpgradePlanToPlus(expirationDate);
                    break;
                case AccessType.Starter:
                    user.Received().UpgradePlanToStarter(expirationDate);
                    break;
                case AccessType.Trial:
                    user.Received().UpgradePlanToTrial(expirationDate);
                    break;
            }
        }

        private void AssertUserSubscriptionWasNotUpdated(User user)
        {
            user.DidNotReceiveWithAnyArgs().DowngradePlanToFree();
            user.DidNotReceiveWithAnyArgs().UpgradePlanToAcademy(Arg.Any<DateTime>());
            user.DidNotReceiveWithAnyArgs().UpgradePlanToAcademyBT(Arg.Any<DateTime>());
            user.DidNotReceiveWithAnyArgs().UpgradePlanToPlus(Arg.Any<DateTime>());
            user.DidNotReceiveWithAnyArgs().UpgradePlanToStarter(Arg.Any<DateTime>());
            user.DidNotReceiveWithAnyArgs().UpgradePlanToTrial(Arg.Any<DateTime>());
        }

        #endregion
    }
}
