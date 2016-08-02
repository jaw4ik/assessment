using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Infrastructure;
using easygenerator.Web.Domain.DomainOperations;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;

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

        #region ApplyOrganizationSettings

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldNotUpdateUserSubscription_WhenOrganizationSettingsSubscriptionIsNotDefined()
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<OrganizationSettings>();
            settings.GetSubscription().Returns(null as UserSubscription);

            //Act
            _userOperations.ApplyOrganizationSettings(user, settings);

            //Assert
            AssertUserSubscriptionWasNotUpdated(user);
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldNotUpdateUserSubscription_WhenUserSubscriptionIsActual()
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<OrganizationSettings>();
            var accessType = AccessType.Trial;
            var expirationDate = DateTime.MinValue;
            settings.GetSubscription().Returns(new UserSubscription(accessType, expirationDate));
            user.AccessType.Returns(accessType);
            user.ExpirationDate.Returns(expirationDate);

            //Act
            _userOperations.ApplyOrganizationSettings(user, settings);

            //Assert
            AssertUserSubscriptionWasNotUpdated(user);
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsFree()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettings(AccessType.Free);
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsTrial()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettings(AccessType.Trial);
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsAcademy()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettings(AccessType.Academy);
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsAcademyBT()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettings(AccessType.AcademyBT);
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsPlus()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettings(AccessType.Plus);
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldUpdateUserSubscription_WhenOrganizationSettingsAccessTypeIsStarter()
        {
            AssertUserSubscriptionUpdatedOnApplyOrganizationSettings(AccessType.Starter);
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldSetUserPersonalSubscription_WhenUserPersonalSubscriptionIsNotDefined()
        {
            //Arrange
            var user = Substitute.For<User>();
            var userSettings = Substitute.For<UserSettings>();
            user.Settings.Returns(userSettings);
            var settings = Substitute.For<OrganizationSettings>();
            var accessType = AccessType.Starter;
            var expirationDate = DateTime.MinValue;
            user.AccessType.Returns(accessType);
            user.ExpirationDate.Returns(expirationDate);

            settings.GetSubscription().Returns(new UserSubscription(AccessType.Academy, DateTime.MaxValue));

            userSettings.GetPersonalSubscription().Returns(null as UserSubscription);

            //Act
            _userOperations.ApplyOrganizationSettings(user, settings);

            //Assert
            userSettings.Received().UpdatePersonalSubscription(accessType, expirationDate);
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldSetUserPersonalSubscription_WithMinExpirationDate_WhenUserPersonalSubscriptionIsNotDefined_AndUserExpirationDateIsNull()
        {
            //Arrange
            var user = Substitute.For<User>();
            var userSettings = Substitute.For<UserSettings>();
            user.Settings.Returns(userSettings);
            var settings = Substitute.For<OrganizationSettings>();
            var accessType = AccessType.Starter;
            user.AccessType.Returns(accessType);
            user.ExpirationDate.Returns(null as DateTime?);

            settings.GetSubscription().Returns(new UserSubscription(AccessType.Academy, DateTime.MaxValue));

            userSettings.GetPersonalSubscription().Returns(null as UserSubscription);

            //Act
            _userOperations.ApplyOrganizationSettings(user, settings);

            //Assert
            userSettings.Received().UpdatePersonalSubscription(accessType, DateTimeWrapper.MinValue());
        }

        [TestMethod]
        public void ApplyOrganizationSettings_ShouldNotUpdatetUserPersonalSubscription_WhenUserPersonalSubscriptionIsDefinedAlready()
        {
            //Arrange
            var user = Substitute.For<User>();
            var userSettings = Substitute.For<UserSettings>();
            user.Settings.Returns(userSettings);
            var settings = Substitute.For<OrganizationSettings>();
            var accessType = AccessType.Starter;
            var expirationDate = DateTime.MinValue;
            user.AccessType.Returns(accessType);
            user.ExpirationDate.Returns(expirationDate);

            settings.GetSubscription().Returns(new UserSubscription(AccessType.Academy, DateTime.MaxValue));

            userSettings.GetPersonalSubscription().Returns(new UserSubscription(AccessType.AcademyBT, DateTime.MaxValue));

            //Act
            _userOperations.ApplyOrganizationSettings(user, settings);

            //Assert
            userSettings.DidNotReceive().UpdatePersonalSubscription(Arg.Any<AccessType>(), Arg.Any<DateTime>());
        }

        #endregion

        #region DiscardOrganizationSettings

        [TestMethod]
        public void DiscardOrganizationSettings_ShouldNotUpdateUserSubscriotion_WhenUserSettingsPersonalSubscriptionIsNotDefined()
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<UserSettings>();
            user.Settings.Returns(settings);
            settings.GetPersonalSubscription().Returns(null as UserSubscription);

            //Act
            _userOperations.DiscardOrganizationSettings(user);

            //Assert
            AssertUserSubscriptionWasNotUpdated(user);
        }

        [TestMethod]
        public void DiscardOrganizationSettings_ShouldNotResetUserSettingsPersonalSubscription_WhenUserSettingsPersonalSubscriptionIsNotDefined()
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<UserSettings>();
            user.Settings.Returns(settings);
            settings.GetPersonalSubscription().Returns(null as UserSubscription);

            //Act
            _userOperations.DiscardOrganizationSettings(user);

            //Assert
            settings.DidNotReceive().ResetPersonalSubscription();
        }

        [TestMethod]
        public void DiscardOrganizationSettings_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsFree()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettings(AccessType.Free);
        }

        [TestMethod]
        public void DiscardOrganizationSettings_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsTrial()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettings(AccessType.Trial);
        }

        [TestMethod]
        public void DiscardOrganizationSettings_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsAcademy()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettings(AccessType.Academy);
        }

        [TestMethod]
        public void DiscardOrganizationSettings_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsAcademyBT()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettings(AccessType.AcademyBT);
        }

        [TestMethod]
        public void DiscardOrganizationSettings_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsPlus()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettings(AccessType.Plus);
        }

        [TestMethod]
        public void DiscardOrganizationSettings_ShouldUpdateUserSubscription_WhenUserSettingsPersonalAccessTypeIsStarter()
        {
            AssertUserSubscriptionUpdatedOnDiscardOrganizationSettings(AccessType.Starter);
        }


        [TestMethod]
        public void DiscardOrganizationSettings_ShouldResetUserSettingsPersonalSubscription()
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<UserSettings>();
            user.Settings.Returns(settings);
            settings.GetPersonalSubscription().Returns(new UserSubscription(AccessType.Free, DateTime.MinValue));

            //Act
            _userOperations.DiscardOrganizationSettings(user);

            //Assert
            settings.Received().ResetPersonalSubscription();
        }

        #endregion

        #region Helper methods

        private void AssertUserSubscriptionUpdatedOnApplyOrganizationSettings(AccessType accessType)
        {
            //Arrange
            var user = Substitute.For<User>();
            user.Settings.Returns(Substitute.For<UserSettings>());
            var settings = Substitute.For<OrganizationSettings>();
            var expirationDate = DateTime.MinValue;
            settings.GetSubscription().Returns(new UserSubscription(accessType, expirationDate));

            //Act
            _userOperations.ApplyOrganizationSettings(user, settings);

            //Assert
            AssertUserSubscriptionUpdated(user, accessType, expirationDate);
        }

        private void AssertUserSubscriptionUpdatedOnDiscardOrganizationSettings(AccessType accessType)
        {
            //Arrange
            var user = Substitute.For<User>();
            var settings = Substitute.For<UserSettings>();
            user.Settings.Returns(settings);
            var expirationDate = DateTime.MinValue;
            settings.GetPersonalSubscription().Returns(new UserSubscription(accessType, expirationDate));

            //Act
            _userOperations.DiscardOrganizationSettings(user);

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
