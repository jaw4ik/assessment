using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class UserSettingsTests
    {
        [TestInitialize]
        public void InitializeContext()
        {
        }

        #region Constructor

        [TestMethod]
        public void UserSettings_ShouldCreateSettings()
        {
            //Arrange
            var createdBy = "user";
            var lastReadReleaseNote = "1.0.0";
            var lastPassedSurveyPopup = "1";

            //Act
            var settings = new UserSettings(createdBy, lastReadReleaseNote, lastPassedSurveyPopup, false, false, true, true, false);

            //Assert
            settings.CreatedBy.Should().Be(createdBy);
            settings.LastReadReleaseNote.Should().Be(lastReadReleaseNote);
            settings.LastPassedSurveyPopup.Should().Be(lastPassedSurveyPopup);
            settings.IsCreatedThroughLti.Should().BeFalse();
            settings.IsCreatedThroughSamlIdP.Should().BeFalse();
            settings.NewEditor.Should().BeTrue();
            settings.IsNewEditorByDefault.Should().BeTrue();
            settings.IncludeMediaToPackage.Should().BeFalse();
        }

        #endregion

        #region UpdateLastReadReleaseNote

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.UpdateLastReadReleaseNote("UA", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.UpdateLastReadReleaseNote("UA", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldThrowArgumentNullException_WhenLastReadReleaseNoteIsNull()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.UpdateLastReadReleaseNote(null, "aaa");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("lastReadReleaseNote");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldThrowArgumentException_WhenLastReadReleaseNoteIsEmpty()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.UpdateLastReadReleaseNote(string.Empty, "aaa");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("lastReadReleaseNote");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldSetLastReadReleaseNote()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();

            //Act
            settings.UpdateLastReadReleaseNote("Ukraine", "someUser");

            //Assert
            settings.LastReadReleaseNote.Should().Be("Ukraine");
            settings.ModifiedBy.Should().Be("someUser");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var settings = UserSettingsObjectMother.Create();
            settings.UpdateLastReadReleaseNote("aaa", modifiedBy);

            settings.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var settings = UserSettingsObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            settings.UpdateLastReadReleaseNote("aaa", modifiedBy);

            settings.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region UpdateSurveyPopupVersion

        [TestMethod]
        public void UpdateSurveyPopupVersion_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.UpdateSurveyPopupVersion("0", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateSurveyPopupVersion_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.UpdateSurveyPopupVersion("0", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateSurveyPopupVersion_ShouldThrowArgumentNullException_WhenSurveyPopupVersionIsNull()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.UpdateSurveyPopupVersion(null, "aaa");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("surveyPopupVersion");
        }

        [TestMethod]
        public void UpdateSurveyPopupVersion_ShouldThrowArgumentException_WhenSurveyPopupVersionIsEmpty()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.UpdateSurveyPopupVersion(string.Empty, "aaa");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("surveyPopupVersion");
        }

        [TestMethod]
        public void UpdateSurveyPopupVersion_ShouldSetLastPassedSurveyPopup()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();

            //Act
            settings.UpdateSurveyPopupVersion("125", "someUser");

            //Assert
            settings.LastPassedSurveyPopup.Should().Be("125");
            settings.ModifiedBy.Should().Be("someUser");
        }

        [TestMethod]
        public void UpdateSurveyPopupVersion_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var settings = UserSettingsObjectMother.Create();
            settings.UpdateSurveyPopupVersion("aaa", modifiedBy);

            settings.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void UpdateSurveyPopupVersion_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var settings = UserSettingsObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            settings.UpdateSurveyPopupVersion("aaa", modifiedBy);

            settings.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region SwitchEditor

        [TestMethod]
        public void SwitchEditor_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.SwitchEditor(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void SwitchEditor_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.SwitchEditor(string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void SwitchEditor_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var settings = UserSettingsObjectMother.Create();
            settings.SwitchEditor(modifiedBy);

            settings.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void SwitchEditor_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var settings = UserSettingsObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            settings.SwitchEditor(modifiedBy);

            settings.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void SwitchEditor_WhenNewEditorIsNull_ShouldSetNewEditorToTrue()
        {
            var settings = UserSettingsObjectMother.Create();
            const string modifiedBy = "admin";

            settings.SwitchEditor(modifiedBy);

            settings.NewEditor.Should().Be(true);
        }

        [TestMethod]
        public void SwitchEditor_WhenNewEditorIsFalse_ShouldSetNewEditorToTrue()
        {
            var settings = UserSettingsObjectMother.Create(newEditor: false);

            const string modifiedBy = "admin";

            settings.SwitchEditor(modifiedBy);

            settings.NewEditor.Should().Be(true);
        }

        [TestMethod]
        public void SwitchEditor_WhenNewEditorIsTrue_ShouldSetNewEditorToFalse()
        {
            var settings = UserSettingsObjectMother.Create(newEditor: true);

            const string modifiedBy = "admin";

            settings.SwitchEditor(modifiedBy);

            settings.NewEditor.Should().Be(false);
        }

        #endregion

        #region SwitchIncludeMediaToPackage

        [TestMethod]
        public void SwitchIncludeMediaToPackage_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.SwitchIncludeMediaToPackage(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void SwitchIncludeMediaToPackage_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var settings = UserSettingsObjectMother.Create();

            Action action = () => settings.SwitchIncludeMediaToPackage(string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void SwitchIncludeMediaToPackage_ShouldChangeIncludeMediaToPackage()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();
            var includeMediaLastValue = settings.IncludeMediaToPackage;

            //Act
            settings.SwitchIncludeMediaToPackage("someUser");

            //Assert
            settings.IncludeMediaToPackage.Should().Be(!includeMediaLastValue);
            settings.ModifiedBy.Should().Be("someUser");
        }

        [TestMethod]
        public void SwitchIncludeMediaToPackage_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var settings = UserSettingsObjectMother.Create();
            settings.SwitchIncludeMediaToPackage(modifiedBy);

            settings.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void SwitchIncludeMediaToPackage_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var settings = UserSettingsObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            settings.SwitchIncludeMediaToPackage(modifiedBy);

            settings.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region GetPersonalSubscription

        [TestMethod]
        public void GetPersonalSubscription_ShouldReturnUserSubscription_WhenPersonalAccessTypeAndExpirationDateAreSet()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();
            var accessType = AccessType.Trial;
            var expirationDate = DateTimeWrapper.Now();
            settings.UpdatePersonalSubscription(accessType, expirationDate);

            //Act
            var subscription = settings.GetPersonalSubscription();

            //Assert
            Assert.IsNotNull(subscription);
            subscription.AccessType.ShouldBeEquivalentTo(accessType);
            subscription.ExpirationDate.ShouldBeEquivalentTo(expirationDate);
        }

        [TestMethod]
        public void GetPersonalSubscription_ShouldReturnNull_WhenPersonalAccessTypeAndExpirationDateAreNot()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();

            //Act
            var subscription = settings.GetPersonalSubscription();

            //Assert
            Assert.IsNull(subscription);
        }

        #endregion

        #region UpdatePersonalSubscription

        [TestMethod]
        public void UpdatePersonalSubscription_ShouldThrowArgumentException_WhenExpirationDateIsLessThatSqlMinDate()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();
            var accessType = AccessType.Trial;
            var expirationDate = DateTime.MinValue;

            //Act
            Action action = () => settings.UpdatePersonalSubscription(accessType, expirationDate);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpdatePersonalSubscription_ShouldSetPersonalAccessType()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();
            var accessType = AccessType.Trial;
            var expirationDate = DateTimeWrapper.Now();

            //Act
            settings.UpdatePersonalSubscription(accessType, expirationDate);

            //Assert
            settings.PersonalAccessType.Should().Be(accessType);
        }

        [TestMethod]
        public void UpdatePersonalSubscription_ShouldSetPersonalExpirationDate()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();
            var accessType = AccessType.Trial;
            var expirationDate = DateTimeWrapper.Now();

            //Act
            settings.UpdatePersonalSubscription(accessType, expirationDate);

            //Assert
            settings.PersonalExpirationDate.Should().Be(expirationDate);
        }

        #endregion

        #region ResetPersonalSubscription

        [TestMethod]
        public void ResetPersonalSubscription_ShouldSetPersonalAccessTypeToNull()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();
            var accessType = AccessType.Trial;
            var expirationDate = DateTimeWrapper.Now();
            settings.UpdatePersonalSubscription(accessType, expirationDate);

            //Act
            settings.ResetPersonalSubscription();

            //Assert
            settings.PersonalAccessType.HasValue.Should().BeFalse();
        }

        [TestMethod]
        public void ResetPersonalSubscription_ShouldSetPersonalExpirationDateToNull()
        {
            //Arrange
            var settings = UserSettingsObjectMother.Create();
            var accessType = AccessType.Trial;
            var expirationDate = DateTimeWrapper.Now();
            settings.UpdatePersonalSubscription(accessType, expirationDate);

            //Act
            settings.ResetPersonalSubscription();

            //Assert
            settings.PersonalExpirationDate.HasValue.Should().BeFalse();
        }

        #endregion

    }
}
