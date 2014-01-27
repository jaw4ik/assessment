using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class CourseTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Course_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => CourseObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Course_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => CourseObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Course_ShouldThrowArgumentException_WhenTemplateIsNull()
        {
            Action action = () => CourseObjectMother.CreateWithTemplate(null);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void Course_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => CourseObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Course_ShouldCreateCourseInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var course = CourseObjectMother.Create(title, CreatedBy);

            course.Id.Should().NotBeEmpty();
            course.Title.Should().Be(title);
            course.CreatedOn.Should().Be(DateTime.MaxValue);
            course.ModifiedOn.Should().Be(DateTime.MaxValue);
            course.RelatedObjectives.Should().BeEmpty();
            course.TemplateSettings.Should().BeEmpty();
            course.CreatedBy.Should().Be(CreatedBy);
            course.ModifiedBy.Should().Be(CreatedBy);
            course.IntroductionContent.Should().BeNull();
        }

        #endregion

        #region RelateObjective

        [TestMethod]
        public void RelateObjective_ShouldThrowNullArgumentException_WhenObjectiveIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.RelateObjective(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("objective");
        }

        [TestMethod]
        public void RelateObjective_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            course.RelateObjective(objective, ModifiedBy);

            //Assert
            course.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void RelateObjective_ShouldRelateObjectiveToCourse()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            course.RelateObjective(objective, ModifiedBy);

            //Assert
            course.RelatedObjectives.Should().Contain(objective);
        }

        [TestMethod]
        public void RelateObjective_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();

            Action action = () => course.RelateObjective(objective, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RelateObjective_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();

            Action action = () => course.RelateObjective(objective, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RelateObjective_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            var user = "Some user";

            course.RelateObjective(objective, user);

            course.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region UnrelateObjective

        [TestMethod]
        public void UnrelateObjective_ShouldThrowNullArgumentException_WhenObjectiveIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.UnrelateObjective(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("objective");
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateObjective(objective, ModifiedBy);
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            course.UnrelateObjective(objective, ModifiedBy);

            //Assert
            course.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUnrelateObjectiveFromCourse()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateObjective(objective, ModifiedBy);

            //Act
            course.UnrelateObjective(objective, ModifiedBy);

            //Assert
            course.RelatedObjectives.Should().NotContain(objective);
        }

        [TestMethod]
        public void UnrelateObjective_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateObjective(objective, ModifiedBy);

            Action action = () => course.UnrelateObjective(objective, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UnrelateObjective_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateObjective(objective, ModifiedBy);

            Action action = () => course.UnrelateObjective(objective, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateObjective(objective, ModifiedBy);
            var user = "Some user";

            course.UnrelateObjective(objective, user);

            course.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var course = CourseObjectMother.Create();

            course.UpdateTitle(title, ModifiedBy);

            course.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var course = CourseObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            course.UpdateTitle("title", ModifiedBy);

            course.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var course = CourseObjectMother.Create();
            var user = "Some user";

            course.UpdateTitle("Some title", user);

            course.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region UpdateTemplate

        [TestMethod]
        public void UpdateTemplate_ShouldThrowArgumentNullException_WhenTemplateIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.UpdateTemplate(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void UpdateTemplate_ShouldUpdateTemplate()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();

            //Act
            course.UpdateTemplate(template, ModifiedBy);

            //Assert
            course.Template.Should().Be(template);
        }

        [TestMethod]
        public void UpdateTemplate_ShouldUpdateModificationDate()
        {
            //Arrange
            DateTimeWrapper.Now = () => DateTime.Now;
            var course = CourseObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            var template = TemplateObjectMother.Create();

            //Act
            course.UpdateTemplate(template, ModifiedBy);

            //Assert
            course.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTemplate_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var template = TemplateObjectMother.Create();
            var course = CourseObjectMother.Create();

            Action action = () => course.UpdateTemplate(template, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTemplate_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var template = TemplateObjectMother.Create();
            var course = CourseObjectMother.Create();

            Action action = () => course.UpdateTemplate(template, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTemplate_ShouldUpdateMoidifiedBy()
        {
            var template = TemplateObjectMother.Create();
            var course = CourseObjectMother.Create();
            var user = "Some user";

            course.UpdateTemplate(template, user);

            course.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region UpdatePackageUrl

        [TestMethod]
        public void UpdatePackageUrl_ShouldThrowArgumentNullException_WhenPackageUrlIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.UpdatePackageUrl(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("packageUrl");
        }

        [TestMethod]
        public void UpdatePackageUrl_ShouldThrowArgumentException_WhenPackageUrlIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.UpdatePackageUrl(string.Empty);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("packageUrl");
        }

        [TestMethod]
        public void UpdatePackageUrl_ShouldUpdatePackageUrlAndBuildOnDate()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var packageUrl = "SomeUrl";

            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            course.UpdatePackageUrl(packageUrl);

            //Assert
            course.PackageUrl.Should().Be(packageUrl);
            course.BuildOn.Should().Be(DateTime.MaxValue);
        }

        #endregion

        #region UpdateScormPackageUrl

        [TestMethod]
        public void UpdateScormPackageUrl_ShouldThrowArgumentNullException_WhenPackageUrlIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.UpdateScormPackageUrl(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("packageUrl");
        }

        [TestMethod]
        public void UpdateScormPackageUrl_ShouldThrowArgumentException_WhenPackageUrlIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.UpdateScormPackageUrl(string.Empty);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("packageUrl");
        }

        [TestMethod]
        public void UpdateScormPackageUrl_ShouldUpdatePackageUrlAndBuildOnDate()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var packageUrl = "SomeUrl";

            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            course.UpdateScormPackageUrl(packageUrl);

            //Assert
            course.ScormPackageUrl.Should().Be(packageUrl);
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var course = CourseObjectMother.CreateWithCreatedBy(createdBy);

            course.DefineCreatedBy(updatedCreatedBy);

            course.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var course = CourseObjectMother.CreateWithCreatedBy(createdBy);

            course.DefineCreatedBy(updatedCreatedBy);

            course.ModifiedBy.Should().Be(updatedCreatedBy);
        }


        #endregion

        #region UpdatePublishedOnDate

        [TestMethod]
        public void UpdatePublishedOnDate_ShouldUpdatePublishedOn()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            course.UpdatePublishedOnDate();

            //Assert
            course.PublishedOn.Should().Be(DateTime.MaxValue);
        }

        #endregion

        #region GetTemplateSettings

        [TestMethod]
        public void GetTemplateSettings_ShouldThrowArgumentNullException_WhenTemplateIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.GetTemplateSettings(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void GetTemplateSettings_ShouldReturnNull_WhenThereAreNoSettingsForCurrentTemplate()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.TemplateSettings = new List<Course.CourseTemplateSettings>();

            //Act
            var settings = course.GetTemplateSettings(TemplateObjectMother.Create());

            //Assert
            settings.Should().BeNull();
        }

        [TestMethod]
        public void GetTemplateSettings_ShouldReturnTemplateSettings()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            const string json = "{ url: \"http://google.com\"";
            course.TemplateSettings = new List<Course.CourseTemplateSettings>() { CourseTemplateSettingsObjectMother.Create(course, template, json) };

            //Act
            var settings = course.GetTemplateSettings(template);

            //Assert
            settings.Should().Be(json);
        }

        #endregion

        #region SaveTemplateSettings

        [TestMethod]
        public void SaveTemplateSettings_ShouldThrowArgumentNullException_WhenTemplateIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.SaveTemplateSettings(null, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldUpdateSettings_WhenTheyAlreadyExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            const string settings = "settings";
            course.TemplateSettings = new Collection<Course.CourseTemplateSettings>() { CourseTemplateSettingsObjectMother.Create(course, template, "previous settings") };

            //Act
            course.SaveTemplateSettings(template, settings);

            //Assert
            course.TemplateSettings.Count.Should().Be(1);
            course.TemplateSettings.First().Settings.Should().Be(settings);
        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldAddSettings_WhenTheyDoNotExistYet()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            const string settings = "settings";
            course.TemplateSettings = new Collection<Course.CourseTemplateSettings>();

            //Act
            course.SaveTemplateSettings(template, settings);

            //Assert
            course.TemplateSettings.Count.Should().Be(1);
            course.TemplateSettings.First().Course.Should().Be(course);
            course.TemplateSettings.First().Template.Should().Be(template);
            course.TemplateSettings.First().Settings.Should().Be(settings);
        }

        #endregion

        #region UpdateIntroductionContent

        [TestMethod]
        public void UpdateIntroductionContent_ShouldUpdateContent()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var content = "Some content";
            var user = "some user";

            //Act
            course.UpdateIntroductionContent(content, user);

            //Assert
            course.IntroductionContent.Should().Be(content);
        }

        [TestMethod]
        public void UpdateIntroductionContent_ShouldUpdateModificationDate()
        {
            //Arrange
            var content = "Some content";
            var user = "some user";
            DateTimeWrapper.Now = () => DateTime.Now;
            var course = CourseObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(1);
            DateTimeWrapper.Now = () => dateTime;
            
            //Act
            course.UpdateIntroductionContent(content, user);

            //Assert
            course.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateIntroductionContent_ShouldUpdateModifiedBy()
        {
            //Arrange
            var content = "Some content";
            var user = "some user";
            var course = CourseObjectMother.Create();

            //Act
            course.UpdateIntroductionContent(content, user);

            //Assert
            course.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateIntroductionContents_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.UpdateIntroductionContent("some content", null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateIntroductionContent_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.UpdateIntroductionContent("someContent", "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        #endregion UpdateIntroductionContent
    }
}
