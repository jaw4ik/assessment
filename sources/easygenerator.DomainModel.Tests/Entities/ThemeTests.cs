using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using easygenerator.DomainModel.Events.ThemeEvents;
using easygenerator.DomainModel.Tests.Utils;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class ThemeTests
    {
        private const string ModifiedBy = "easygenerator1@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => _currentDate;
        }

        #region Constructor

        [TestMethod]
        public void Theme_ShouldThrowArgumentNullException_WhenTemplatesNull()
        {
            Action action = () => ThemeObjectMother.CreateWithTemplate(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void Theme_ShouldThrowArgumentNullException_WhenNameIsNull()
        {
            Action action = () => ThemeObjectMother.CreateWithName(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("name");
        }

        [TestMethod]
        public void Theme_ShouldThrowArgumentOutOfRangeException_WhenNameIsLongerThan255()
        {
            Action action = () => ThemeObjectMother.CreateWithName(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("name");
        }

        [TestMethod]
        public void Theme_ShouldThrowArgumentNullException_WhenSettingsAreNull()
        {
            Action action = () => ThemeObjectMother.CreateWithSettings(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("settings");
        }

        [TestMethod]
        public void Theme_ShouldCreateDocumentInstance()
        {
            const string name = "name";
            const string settings = "{key: 'value'}";
            var template = TemplateObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var theme = ThemeObjectMother.Create(template, name, settings, CreatedBy);

            theme.Id.Should().NotBeEmpty();
            theme.Name.Should().Be(name);
            theme.Settings.Should().Be(settings);
            theme.CreatedOn.Should().Be(DateTime.MaxValue);
            theme.ModifiedOn.Should().Be(DateTime.MaxValue);
            theme.CreatedBy.Should().Be(CreatedBy);
            theme.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Update

        [TestMethod]
        public void Update_ShouldThrowArgumentNullException_WhenSettingsAreNull()
        {
            var theme = ThemeObjectMother.Create();

            Action action = () => theme.Update(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("settings");
        }

        [TestMethod]
        public void Update_ShouldUpdateSettings()
        {
            const string settings = "{param:'tadam'}";
            var theme = ThemeObjectMother.Create();

            theme.Update(settings, ModifiedBy);

            theme.Settings.Should().Be(settings);
        }

        [TestMethod]
        public void Update_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var theme = ThemeObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            theme.Update("{}", ModifiedBy);

            theme.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void Update_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var theme = ThemeObjectMother.Create();

            Action action = () => theme.Update("{}", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void Update_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var theme = ThemeObjectMother.Create();

            Action action = () => theme.Update("{}", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void Update_ShouldUpdateMoidifiedBy()
        {
            var theme = ThemeObjectMother.Create();

            theme.Update("{}", ModifiedBy);

            theme.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void Update_ShouldRaiseThemeUpdatedEvent()
        {
            var theme = ThemeObjectMother.Create();

            theme.Update("{}", ModifiedBy);

            theme.ShouldContainSingleEventOfType<ThemeUpdatedEvent>();
        }

        #endregion
    }
}
