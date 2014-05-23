using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class CourseTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);
        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => _currentDate;
        }

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
            course.CommentsCollection.Should().BeEmpty();
            course.CollaboratorsCollection.Should().BeEmpty();
            course.TemplateSettings.Should().BeEmpty();
            course.CreatedBy.Should().Be(CreatedBy);
            course.ModifiedBy.Should().Be(CreatedBy);
            course.IntroductionContent.Should().BeNull();
            course.ObjectivesOrder.Should().BeNull();
        }

        #endregion

        #region RelateObjective

        [TestMethod]
        public void RelateObjective_ShouldThrowNullArgumentException_WhenObjectiveIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.RelateObjective(null, null, ModifiedBy);

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
            course.RelateObjective(objective, null, ModifiedBy);

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
            course.RelateObjective(objective, null, ModifiedBy);

            //Assert
            course.RelatedObjectives.Should().Contain(objective);
        }

        [TestMethod]
        public void RelateObjective_ShouldUpdateObjectivesOrderedListAndInsertToEnd()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            var objective1 = ObjectiveObjectMother.Create();
            course.RelatedObjectivesCollection = new Collection<Objective>()
            {
                objective
            };
            var objectiveCollection = new List<Objective>() { objective };
            course.UpdateObjectivesOrder(objectiveCollection, ModifiedBy);
            objectiveCollection.Add(objective1);
            var result = String.Join(",", objectiveCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            course.RelateObjective(objective1, null, ModifiedBy);

            //Assert
            course.ObjectivesOrder.Should().Be(result);
        }

        [TestMethod]
        public void RelateObjective_ShouldUpdateObjectivesOrderedListAndInsertToPosition()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            var objective1 = ObjectiveObjectMother.Create();
            var objective2 = ObjectiveObjectMother.Create();
            const int position = 1;
            course.RelatedObjectivesCollection = new Collection<Objective>()
            {
                objective,
                objective1
            };
            var objectiveCollection = new List<Objective>() { objective, objective1 };
            course.UpdateObjectivesOrder(objectiveCollection, ModifiedBy);
            objectiveCollection.Insert(position, objective2);
            var result = String.Join(",", objectiveCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            course.RelateObjective(objective2, 1, ModifiedBy);

            //Assert
            course.ObjectivesOrder.Should().Be(result);
        }

        [TestMethod]
        public void RelateObjective_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();

            Action action = () => course.RelateObjective(objective, null, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RelateObjective_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();

            Action action = () => course.RelateObjective(objective, null, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RelateObjective_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            var user = "Some user";

            course.RelateObjective(objective, null, user);

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
            course.RelateObjective(objective, null, ModifiedBy);
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
            course.RelateObjective(objective, null, ModifiedBy);

            //Act
            course.UnrelateObjective(objective, ModifiedBy);

            //Assert
            course.RelatedObjectives.Should().NotContain(objective);
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUpdateObjectivesOrderedList()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            course.RelatedObjectivesCollection = new Collection<Objective>()
            {
                objective
            };
            var objectiveCollection = new List<Objective>() { objective };
            course.UpdateObjectivesOrder(objectiveCollection, ModifiedBy);
            //Act
            course.UnrelateObjective(objective, ModifiedBy);

            //Assert
            course.ObjectivesOrder.Should().Be(null);
        }

        [TestMethod]
        public void UnrelateObjective_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateObjective(objective, null, ModifiedBy);

            Action action = () => course.UnrelateObjective(objective, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UnrelateObjective_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateObjective(objective, null, ModifiedBy);

            Action action = () => course.UnrelateObjective(objective, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateObjective(objective, null, ModifiedBy);
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

        #region IsPermittedTo

        [TestMethod]
        public void IsPermittedTo_ShouldReturnFalse_WhenIsNotCreatedByUserAndUserIsNotACollaborator()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = course.IsPermittedTo("user");

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsPermittedTo_ShouldReturnTrue_WhenIsCreatedByUserAndUser()
        {
            //Arrange
            const string username = "user";
            var course = CourseObjectMother.Create(createdBy: username);

            //Act
            var result = course.IsPermittedTo(username);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsPermittedTo_ShouldReturnTrue_WhenIsCollaborator()
        {
            //Arrange
            const string username = "user@user.com";
            var course = CourseObjectMother.Create();

            var user = UserObjectMother.CreateWithEmail(username);
            course.CollaborateWithUser(user, CreatedBy);

            //Act
            var result = course.IsPermittedTo(username);

            //Assert
            result.Should().BeTrue();
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

        #region UpdatePublicationUrl

        [TestMethod]
        public void UpdatePublicationUrl_ShouldUpdatePublishedOn()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            course.UpdatePublicationUrl("some url");

            //Assert
            course.PublishedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void UpdatePublicationUrl_ShouldUpdatePublicationUrl()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            course.UpdatePublicationUrl("some url");

            //Assert
            course.PublicationUrl.Should().Be("some url");
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
            course.TemplateSettings = new List<Course.CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, json)
            };

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
            course.TemplateSettings = new Collection<Course.CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, "previous settings")
            };

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

        #region CollaborateWithUser

        [TestMethod]
        public void CollaborateWithUser_ShouldThrowArgumentNullException_WhenCommentIsNull()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.CollaborateWithUser(null, CreatedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("user");
        }

        [TestMethod]
        public void CollaborateWithUser_ShouldAddCollaborator()
        {
            const string owner = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: owner);
            var user = UserObjectMother.Create();

            course.CollaborateWithUser(user, CreatedBy);

            course.CollaboratorsCollection.Should().NotBeEmpty().And.HaveCount(1);
        }

        [TestMethod]
        public void CollaborateWithUser_ShouldReturnCourseCollaborator()
        {
            const string owner = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: owner);
            var user = UserObjectMother.Create();

            var result = course.CollaborateWithUser(user, CreatedBy);

            result.Should().BeOfType<CourseCollabrator>();
        }

        [TestMethod]
        public void CollaborateWithUser_ShouldNotAddCollaborator_WhenUserIsCourseOwner()
        {
            const string email = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: email);
            var user = UserObjectMother.CreateWithEmail(email);

            course.CollaborateWithUser(user, CreatedBy);

            course.CollaboratorsCollection.Should().BeEmpty();
        }

        [TestMethod]
        public void CollaborateWithUser_ShouldReturnNull_WhenUserIsCourseOwner()
        {
            const string email = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: email);
            var user = UserObjectMother.CreateWithEmail(email);

            var result = course.CollaborateWithUser(user, CreatedBy);

            result.Should().BeNull();
        }

        [TestMethod]
        public void CollaborateWithUser_ShouldNotAddCollaborator_WhenUserIsCourseCollaboratorAlready()
        {
            const string email = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: "user@www.www");
            var user = UserObjectMother.CreateWithEmail(email);
            course.CollaborateWithUser(user, CreatedBy);

            course.CollaborateWithUser(user, CreatedBy);

            course.CollaboratorsCollection.Should().NotBeEmpty().And.HaveCount(1);
        }

        [TestMethod]
        public void CollaborateWithUser_ShouldReturnNull_WhenUserIsCourseCollaboratorAlready()
        {
            const string email = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: "user@www.www");
            var user = UserObjectMother.CreateWithEmail(email);
            course.CollaborateWithUser(user, CreatedBy);

            var result = course.CollaborateWithUser(user, CreatedBy);

            result.Should().BeNull();
        }

        #endregion

        #region AddComment

        [TestMethod]
        public void AddComment_ShouldThrowArgumentNullException_WhenCommentIsNull()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.AddComment(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("comment");
        }

        [TestMethod]
        public void AddComment_ShouldAddComment()
        {
            var course = CourseObjectMother.Create();
            var comment = CommentObjectMother.Create();

            course.AddComment(comment);

            course.Comments.Should().NotBeEmpty().And.HaveCount(1).And.Contain(comment);
        }

        [TestMethod]
        public void AddComment_ShouldSetCourseToComment()
        {
            var course = CourseObjectMother.Create();
            var comment = CommentObjectMother.Create();

            course.AddComment(comment);

            comment.Course.Should().Be(course);
        }

        #endregion

        #region UpdateObjectivesOrder

        [TestMethod]
        public void UpdateObjectivesOrderedList_ShouldUpdateObjectivesOrderedList()
        {
            //Arrange
            var user = "some user";
            var course = CourseObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            var objective1 = ObjectiveObjectMother.Create();
            var objectiveCollection = new List<Objective>()
            {
                objective,
                objective1
            };
            var result = String.Join(",", objectiveCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            course.UpdateObjectivesOrder(objectiveCollection, user);

            //Assert
            course.ObjectivesOrder.Should().Be(result);
        }

        [TestMethod]
        public void UpdateObjectivesOrderedList_ShouldUpdateModificationDate()
        {
            //Arrange
            var user = "some user";
            DateTimeWrapper.Now = () => DateTime.Now;
            var course = CourseObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(1);
            DateTimeWrapper.Now = () => dateTime;
            var objectiveCollection = new List<Objective>()
            {
                ObjectiveObjectMother.Create()
            };

            //Act
            course.UpdateObjectivesOrder(objectiveCollection, user);

            //Assert
            course.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateObjectivesOrderedList_ShouldUpdateModifiedBy()
        {
            //Arrange
            var user = "some user";
            var course = CourseObjectMother.Create();
            var objectiveCollection = new List<Objective>()
            {
                ObjectiveObjectMother.Create()
            };
            //Act
            course.UpdateObjectivesOrder(objectiveCollection, user);

            //Assert
            course.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateObjectivesOrderedList_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var objectiveCollection = new List<Objective>()
            {
                ObjectiveObjectMother.Create()
            };

            //Act
            Action action = () => course.UpdateObjectivesOrder(objectiveCollection, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateObjectivesOrderedList_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var objectiveCollection = new List<Objective>()
            {
                ObjectiveObjectMother.Create()
            };

            //Act
            Action action = () => course.UpdateObjectivesOrder(objectiveCollection, "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        #endregion UpdateObjectivesOrder

        #region RelatedObjectives

        [TestMethod]
        public void RelatedObjectives_ShouldReturnOrderedObjectivesCollection_WhenObjectivesOrderedListNotNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var objective1 = ObjectiveObjectMother.Create();
            var objective2 = ObjectiveObjectMother.Create();
            course.RelatedObjectivesCollection = new Collection<Objective>()
            {
                objective2,
                objective1
            };
            course.ObjectivesOrder = String.Format("{0},{1}", objective1.Id, objective2.Id);

            //Act
            var result = course.RelatedObjectives;

            //Assert
            result.First().Id.Should().Be(objective1.Id);
        }

        [TestMethod]
        public void RelatedObjectives_ShouldReturnAllObjectivesInCorrectOrder_WhenObjectivesOrderedListIsNotFull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var objective1 = ObjectiveObjectMother.Create();
            var objective2 = ObjectiveObjectMother.Create();
            course.RelatedObjectivesCollection = new Collection<Objective>()
            {
                objective2,
                objective1
            };
            course.ObjectivesOrder = objective1.Id.ToString();

            //Act
            var result = course.RelatedObjectives;

            //Assert
            result.Count().Should().Be(2);
            result.First().Should().Be(objective1);
        }

        [TestMethod]
        public void RelatedObjectives_ShouldReturnAllObjectivesInCorrectOrder_WhenObjectivesOrderedListIsOverfull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var objective1 = ObjectiveObjectMother.Create();
            var objective2 = ObjectiveObjectMother.Create();
            course.RelatedObjectivesCollection = new Collection<Objective>()
            {
                objective2
            };
            course.ObjectivesOrder = String.Format("{0},{1}", objective1.Id, objective2.Id);

            //Act
            var result = course.RelatedObjectives;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(objective2);
        }

        #endregion RelatedObjectives

        #region Aim4YouIntegration

        [TestMethod]
        public void IsRegisteredOnAimForYou_ShouldReturnFalseIfAim4YouIntegrationIsNull()
        {
            var course = CourseObjectMother.Create();

            course.IsRegisteredOnAimForYou().Should().Be(false);
        }

        [TestMethod]
        public void IsRegisteredOnAimForYou_ShouldReturnFalseIfAim4YouIntegrationIsNotNullButAim4YouCourseIsEmptyGuid()
        {
            var course = CourseObjectMother.CreateWithAim4YouIntegration(Guid.Empty);

            course.IsRegisteredOnAimForYou().Should().Be(false);
        }

        [TestMethod]
        public void IsRegisteredOnAimForYou_ShouldReturnTrueIfAim4YouIntegrationIsNotNullAndAim4YouCourseIsNonEmptyGuid()
        {
            var course = CourseObjectMother.CreateWithAim4YouIntegration();

            course.IsRegisteredOnAimForYou().Should().Be(true);
        }

        [TestMethod]
        public void Aim4YouCourseId_ShouldBeSameAsWasRegistered()
        {
            Guid aim4YouCourseId = Guid.NewGuid();
            var course = CourseObjectMother.CreateWithAim4YouIntegration(aim4YouCourseId);

            course.Aim4YouIntegration.Aim4YouCourseId.Should().Be(aim4YouCourseId);
        }

        #endregion    }
    }
}
