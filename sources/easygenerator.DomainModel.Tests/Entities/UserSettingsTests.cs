using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class UserSettingsTests
    {
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Contructor

        [TestMethod]
        public void UserSettings_ShouldCreateUserSettings()
        {
            //Arrange
            var isShowIntroduction = false;
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            var userSettings = UserSettingsObjectMother.Create(CreatedBy, isShowIntroduction);

            //Assert
            userSettings.Id.Should().NotBeEmpty();
            userSettings.IsShowIntroductionPage.Should().BeFalse();
            userSettings.CreatedBy.Should().Be(CreatedBy);
            userSettings.CreatedOn.Should().Be(DateTime.MaxValue);
            userSettings.ModifiedBy.Should().Be(CreatedBy);
            userSettings.ModifiedOn.Should().Be(DateTime.MaxValue);

        }

        #endregion Constructor

        #region UpdateIsShowIntroduction

        [TestMethod]
        public void UpdateIsShowIntroduction_ShouldUpdateIsShowIntroductionPageToFalse()
        {
            //Arrange
            var userSettings = UserSettingsObjectMother.Create();

            //Act
            userSettings.UpdateIsShowIntroduction(false);

            //Assert
            userSettings.IsShowIntroductionPage.Should().BeFalse();
        }

        [TestMethod]
        public void UpdateIsShowIntroduction_ShouldUpdateIsShowIntroductionPageToTrue()
        {
            //Arrange
            var userSettings = UserSettingsObjectMother.Create();

            //Act
            userSettings.UpdateIsShowIntroduction(true);

            //Assert
            userSettings.IsShowIntroductionPage.Should().BeTrue();
        }

        #endregion UpdateIsShowIntroduction
    }
}
