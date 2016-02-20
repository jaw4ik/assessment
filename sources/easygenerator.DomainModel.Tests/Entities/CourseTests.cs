using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Events.CommentEvents;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class CourseTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";
        private const string UserEmail = "user@easygenerator.com";

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);
        private ICloner _cloner;
        private IDomainEventPublisher _eventPublisher;

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => _currentDate;
            _cloner = Substitute.For<ICloner>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
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

        [TestMethod]
        public void RelateObjective_ShouldAddCourseObjectiveRelatedEvent()
        {
            var course = CourseObjectMother.Create();

            course.RelateObjective(ObjectiveObjectMother.Create(), null, "user");

            course.Events.Should().ContainSingle(e => e.GetType() == typeof(CourseObjectiveRelatedEvent));
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

        [TestMethod]
        public void UnrelateObjective_ShouldAddCourseObjectiveRelatedEvent()
        {
            var objective = ObjectiveObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateObjective(objective, null, ModifiedBy);

            course.UnrelateObjective(objective, "user");

            course.Events.Should().ContainSingle(e => e.GetType() == typeof(CourseObjectivesUnrelatedEvent));
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

        [TestMethod]
        public void UpdateTitle_ShouldAddCourseTitleUpdatedEvent()
        {
            var course = CourseObjectMother.Create();

            course.UpdateTitle("updated title", "user");

            course.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(CourseTitleUpdatedEvent));
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

        [TestMethod]
        public void UpdateTemplate_ShouldAddCourseTemplateUpdatedEvent()
        {
            var course = CourseObjectMother.Create();

            course.UpdateTemplate(TemplateObjectMother.Create(), "user");

            course.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(CourseTemplateUpdatedEvent));
        }

        [TestMethod]
        public void UpdateTemplate_ShouldGrantAccessToCollaborators()
        {
            var course = CourseObjectMother.Create(createdBy: "creator");
            course.Collaborate("aa@aa.aa", "creator");
            course.Collaborate("bb@bb.bb", "creator");

            var template = Substitute.For<Template>();
            course.UpdateTemplate(template, "user");

            template.Received().GrantAccessTo(new[] { "aa@aa.aa", "bb@bb.bb", "creator" });
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

        [TestMethod]
        public void UpdatePublicationUrl_ShouldAddCoursePublishedEvent()
        {
            var course = CourseObjectMother.Create();

            course.UpdatePublicationUrl("url");

            course.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(CoursePublishedEvent));
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

        [TestMethod]
        public void UpdateTitle_ShouldAddCourseIntroductionContentUpdated()
        {
            var course = CourseObjectMother.Create();

            course.UpdateIntroductionContent("updated introduction", "user");

            course.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(CourseIntroductionContentUpdated));
        }

        #endregion UpdateIntroductionContent

        #region Collaborate

        [TestMethod]
        public void Collaborate_ShouldThrowArgumentNullException_WhenUserEmailIsNull()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.Collaborate(null, CreatedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("userEmail");
        }

        [TestMethod]
        public void Collaborate_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.Collaborate(UserEmail, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void Collaborate_ShouldThrowArgumentNullException_WhenUserEmailIsInvalid()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.Collaborate("email", CreatedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("userEmail");
        }

        [TestMethod]
        public void Collaborate_ShouldAddCollaborator()
        {
            const string owner = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: owner);

            course.Collaborate(UserEmail, CreatedBy);

            course.CollaboratorsCollection.Should().NotBeEmpty().And.HaveCount(1);
        }

        [TestMethod]
        public void Collaborate_ShouldReturnCourseCollaborator()
        {
            const string owner = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: owner);

            var result = course.Collaborate(UserEmail, CreatedBy);

            result.Should().BeOfType<CourseCollaborator>();
        }

        [TestMethod]
        public void Collaborate_ShouldNotAddCollaborator_WhenUserIsCourseOwner()
        {
            var course = CourseObjectMother.Create(createdBy: UserEmail);

            course.Collaborate(UserEmail, CreatedBy);

            course.CollaboratorsCollection.Should().BeEmpty();
        }

        [TestMethod]
        public void Collaborate_ShouldReturnNull_WhenUserIsCourseOwner()
        {
            var course = CourseObjectMother.Create(createdBy: UserEmail);

            var result = course.Collaborate(UserEmail, CreatedBy);

            result.Should().BeNull();
        }

        [TestMethod]
        public void Collaborate_ShouldNotAddCollaborator_WhenUserIsCourseCollaboratorAlready()
        {
            const string email = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: UserEmail);
            course.Collaborate(email, CreatedBy);

            course.Collaborate(email, CreatedBy);

            course.CollaboratorsCollection.Should().NotBeEmpty().And.HaveCount(1);
        }

        [TestMethod]
        public void Collaborate_ShouldReturnNull_WhenUserIsCourseCollaboratorAlready()
        {
            const string email = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: UserEmail);
            course.Collaborate(email, CreatedBy);

            var result = course.Collaborate(email, CreatedBy);

            result.Should().BeNull();
        }

        [TestMethod]
        public void Collaborate_ShouldAddCourseCollaboratorAddedEvent()
        {
            const string email = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: UserEmail);
            course.Collaborate(email, CreatedBy);

            course.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(CourseCollaboratorAddedEvent));
        }

        [TestMethod]
        public void Collaborate_ShouldGrantAccessToCollaborator()
        {
            const string email = "owner@www.com";
            var template = Substitute.For<Template>();
            var course = CourseObjectMother.CreateWithTemplate(template);
            course.Collaborate(email, CreatedBy);

            template.Received().GrantAccessTo(new[] { email });
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

        #region DeleteComment

        [TestMethod]
        public void DeleteComment_ShouldThrowArgumentNullException_WhenCommentIsNull()
        {
            // Arrange
            var course = CourseObjectMother.Create();

            // Act
            Action action = () => course.DeleteComment(null);

            // Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("comment");
        }

        [TestMethod]
        public void DeleteComment_ShouldDeleteComment()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var comment = CommentObjectMother.Create();
            course.AddComment(comment);

            // Act
            course.DeleteComment(comment);

            // Assert
            course.Comments.Should().BeEmpty();
        }

        [TestMethod]
        public void DeleteComment_ShouldSetCourseToNullInComment()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var comment = CommentObjectMother.Create();
            course.AddComment(comment);

            // Act
            course.DeleteComment(comment);

            // Assert
            comment.Course.Should().Be(null);
        }

        [TestMethod]
        public void DeleteComment_ShouldAddCommentDeletedEvent()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var comment = CommentObjectMother.Create();
            course.AddComment(comment);

            // Act
            course.DeleteComment(comment);

            // Assert
            course.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(CommentDeletedEvent));
        }

        #endregion

        #region UpdateObjectivesOrder

        [TestMethod]
        public void UpdateObjectivesOrder_ShouldUpdateObjectivesOrderedList()
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
        public void UpdateObjectivesOrder_ShouldUpdateModificationDate()
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
        public void UpdateObjectivesOrder_ShouldUpdateModifiedBy()
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
        public void UpdateObjectivesOrder_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
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
        public void UpdateObjectivesOrder_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
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

        [TestMethod]
        public void UpdateObjectivesOrder_ShouldAddCourseObjectivesReorderedEvent()
        {
            var objective = ObjectiveObjectMother.Create();

            var course = CourseObjectMother.Create();
            course.RelatedObjectivesCollection.Add(objective);

            course.UpdateObjectivesOrder(new Collection<Objective> { objective }, "user");

            course.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(CourseObjectivesReorderedEvent));
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

        #region RemoveCollaborator

        [TestMethod]
        public void RemoveCollaborator_ShouldReturnFalse_WhenCollaboratorNotExist()
        {
            // Arrange
            var course = CourseObjectMother.Create();

            // Act
            var result = course.RemoveCollaborator(_cloner, "some_email");

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldReturnTrue_WhenCollaboratorExists()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            course.Collaborate(email, "createdBy");

            // Act
            var result = course.RemoveCollaborator(_cloner, email);

            // Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldRemoveCollaboratorFromCourse()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert
            course.Collaborators.Count().Should().Be(0);
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldAddCourseCollaboratorRemovedEvent()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert
            course.Events.Should().ContainSingle(e => e.GetType() == typeof(CourseCollaboratorRemovedEvent));
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldMarkCourseAsModified()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert
            course.ModifiedOn.Should().Be(_currentDate);
            course.ModifiedBy.Should().Be(course.CreatedBy);
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldRaiseEventAboutReplacedObjetives()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            var objective = ObjectiveObjectMother.Create(createdBy: email);
            var clonedObjective = ObjectiveObjectMother.Create(createdBy: email);

            var objective2 = ObjectiveObjectMother.Create(createdBy: email);
            var clonedObjective2 = ObjectiveObjectMother.Create(createdBy: email);

            _cloner.Clone(Arg.Is<Objective>(i => i.Id == objective.Id), Arg.Any<object>()).Returns(clonedObjective);
            _cloner.Clone(Arg.Is<Objective>(i => i.Id == objective2.Id), Arg.Any<object>()).Returns(clonedObjective2);

            course.RelateObjective(objective, null, email);
            course.RelateObjective(objective2, null, email);
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert
            course.Events.Where(e => e.GetType() == typeof(CourseObjectivesClonedEvent))
                .Cast<CourseObjectivesClonedEvent>()
                .Should()
                .Contain(args => args.Course == course && args.ReplacedObjectives.Count == 2 && args.ReplacedObjectives.ContainsKey(objective.Id) && args.ReplacedObjectives.ContainsKey(objective2.Id) && args.ReplacedObjectives[objective.Id] == clonedObjective && args.ReplacedObjectives[objective2.Id] == clonedObjective2);
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldRaiseEventOnlyAboutObjectivesOfRemovedCollaborator()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            var objective = ObjectiveObjectMother.Create(createdBy: email);
            var clonedObjective = ObjectiveObjectMother.Create(createdBy: email);

            var objective2 = ObjectiveObjectMother.Create(createdBy: "another creator");
            var clonedObjective2 = ObjectiveObjectMother.Create(createdBy: email);

            _cloner.Clone(Arg.Is<Objective>(i => i.Id == objective.Id), Arg.Any<object>()).Returns(clonedObjective);
            _cloner.Clone(Arg.Is<Objective>(i => i.Id == objective2.Id), Arg.Any<object>()).Returns(clonedObjective2);

            course.RelateObjective(objective, null, email);
            course.RelateObjective(objective2, null, email);
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert            
            course.Events.Where(e => e.GetType() == typeof(CourseObjectivesClonedEvent))
                .Cast<CourseObjectivesClonedEvent>()
                .Should()
                .Contain(args => args.Course == course && args.ReplacedObjectives.Count == 1 && args.ReplacedObjectives.ContainsKey(objective.Id) && args.ReplacedObjectives[objective.Id] == clonedObjective);
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldReplaceObjectivesOfCollaboratorWithClonedObjectives()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            var objective = ObjectiveObjectMother.Create(createdBy: email);
            var clonedObjective = ObjectiveObjectMother.Create(createdBy: email);

            _cloner.Clone(Arg.Is<Objective>(i => i.Id == objective.Id), Arg.Any<object>()).Returns(clonedObjective);
            course.RelateObjective(objective, null, email);
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert
            course.RelatedObjectivesCollection.ElementAt(0).Should().Be(clonedObjective);
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldOrderClonedObjectivesInSameOrderAsOriginal()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            var objective = ObjectiveObjectMother.Create(createdBy: email);
            var clonedObjective = ObjectiveObjectMother.Create(createdBy: email);

            var objective2 = ObjectiveObjectMother.Create(createdBy: email);
            var clonedObjective2 = ObjectiveObjectMother.Create(createdBy: email);

            _cloner.Clone(Arg.Is<Objective>(i => i.Id == objective.Id), Arg.Any<object>()).Returns(clonedObjective);
            _cloner.Clone(Arg.Is<Objective>(i => i.Id == objective2.Id), Arg.Any<object>()).Returns(clonedObjective2);

            course.RelateObjective(objective, null, email);
            course.RelateObjective(objective2, 0, email);
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert
            course.ObjectivesOrder.Should().Be(clonedObjective2.Id + "," + clonedObjective.Id);
        }

        #endregion

        #region AcceptCollaboration

        [TestMethod]
        public void AcceptCollaboration_ShouldThrowNullArgumentException_WhenCollaborationIsNull()
        {
            // Arrange
            var course = CourseObjectMother.Create();

            // Act
            Action action = () => course.AcceptCollaboration(null);

            // Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("courseCollaborator");
        }

        [TestMethod]
        public void AcceptCollaboration_ShouldSetCollaboratorIsAcceptedToTrue()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var collaborator = CourseCollaboratorObjectMother.Create();

            // Act
            course.AcceptCollaboration(collaborator);

            // Assert
            collaborator.IsAccepted.Should().BeTrue();
        }

        [TestMethod]
        public void AcceptCollaboration_ShouldTriggerEvent()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var collaborator = CourseCollaboratorObjectMother.Create();

            // Act
            course.AcceptCollaboration(collaborator);

            // Assert
            course.Events.Should().ContainSingle(e => e.GetType() == typeof(CollaborationInviteAcceptedEvent));
        }

        #endregion

        #region DeclineCollaboration

        [TestMethod]
        public void DeclineCollaboration_ShouldThrowNullArgumentException_WhenCollaborationIsNull()
        {
            // Arrange
            var course = CourseObjectMother.Create();

            // Act
            Action action = () => course.DeclineCollaboration(null);

            // Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("courseCollaborator");
        }

        [TestMethod]
        public void DeclineCollaboration_ShouldRemoveCollaborator()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var collaborator = CourseCollaboratorObjectMother.Create();
            course.CollaboratorsCollection.Add(collaborator);

            // Act
            course.DeclineCollaboration(collaborator);

            // Assert
            course.Collaborators.LongCount().Should().Be(0);
        }

        [TestMethod]
        public void DeclineCollaboration_ShouldTriggerEvent()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var collaborator = CourseCollaboratorObjectMother.Create();
            course.CollaboratorsCollection.Add(collaborator);

            // Act
            course.DeclineCollaboration(collaborator);

            // Assert
            course.Events.Should().ContainSingle(e => e.GetType() == typeof(CollaborationInviteDeclinedEvent));
        }

        #endregion

        #region OrderClonedObjectives

        [TestMethod]
        public void OrderClonedObjectives_ShouldReturnNull_IfClonedObjectivesAreNull()
        {
            var course = CourseObjectMother.Create();

            var result = course.OrderClonedObjectives(null);
            result.Should().BeNull();
        }

        [TestMethod]
        public void OrderClonedObjectives_ShouldThrowArgumentException_IfLengthOfObjectiveCollectionsAreDifferent()
        {
            var course = CourseObjectMother.Create();
            Action action = () => course.OrderClonedObjectives(new Collection<Objective> { ObjectiveObjectMother.Create() });
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("clonedObjectives");
        }

        [TestMethod]
        public void OrderClonedObjectives_ShouldOrderClonedObjectivesAccordingToCourseObjectives()
        {
            var objective1 = ObjectiveObjectMother.Create("objective 1");
            var objective2 = ObjectiveObjectMother.Create("objective 2");
            var objective3 = ObjectiveObjectMother.Create("objective 3");

            var clonedObjective1 = ObjectiveObjectMother.Create("cloned objective 1");
            var clonedObjective2 = ObjectiveObjectMother.Create("cloned objective 2");
            var clonedObjective3 = ObjectiveObjectMother.Create("cloned objective 3");

            var course = CourseObjectMother.Create();
            course.RelateObjective(objective1, null, "owner");
            course.RelateObjective(objective2, null, "owner");
            course.RelateObjective(objective3, null, "owner");
            course.UpdateObjectivesOrder(new Collection<Objective> { objective3, objective1, objective2 }, "owner");

            var result = course.OrderClonedObjectives(new Collection<Objective> { clonedObjective1, clonedObjective2, clonedObjective3 });

            result[0].Should().Be(clonedObjective3);
            result[1].Should().Be(clonedObjective1);
            result[2].Should().Be(clonedObjective2);
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
            course.TemplateSettings = new List<CourseTemplateSettings>();

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
            course.TemplateSettings = new List<CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, json, "")
            };

            //Act
            var settings = course.GetTemplateSettings(template);

            //Assert
            settings.Should().Be(json);
        }

        #endregion

        #region GetExtraDataForTemplate

        [TestMethod]
        public void GetExtraDataForTemplate_ShouldThrowArgumentNullException_WhenTemplateIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.GetExtraDataForTemplate(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void GetExtraDataForTemplate_ShouldReturnNull_WhenThereAreNoExtraDataForCurrentTemplate()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.TemplateSettings = new List<CourseTemplateSettings>();

            //Act
            var settings = course.GetExtraDataForTemplate(TemplateObjectMother.Create());

            //Assert
            settings.Should().BeNull();
        }

        [TestMethod]
        public void GetExtraDataForTemplate_ShouldReturnExtraData()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            const string extraData = "some extra data";
            course.TemplateSettings = new List<CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, "", extraData)
            };

            //Act
            var data = course.GetExtraDataForTemplate(template);

            //Assert
            data.Should().Be(extraData);
        }

        #endregion

        #region SaveTemplateSettings

        [TestMethod]
        public void SaveTemplateSettings_ShouldThrowArgumentNullException_WhenTemplateIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.SaveTemplateSettings(null, null, null);

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
            const string extraData = "extra data";
            course.TemplateSettings = new Collection<CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, "previous settings", "previous extra data")
            };

            //Act
            course.SaveTemplateSettings(template, settings, extraData);

            //Assert
            course.TemplateSettings.Count.Should().Be(1);
            course.TemplateSettings.First().Settings.Should().Be(settings);
            course.TemplateSettings.First().ExtraData.Should().Be(extraData);
        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldAddTemplateSettingsUpdatedEvent_WhenSettingsTheyAlreadyExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            const string settings = "settings";
            const string extraData = "extra data";
            course.TemplateSettings = new Collection<CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, "previous settings", "previous extra data")
            };

            //Act
            course.SaveTemplateSettings(template, settings, extraData);

            //Assert
            course.Events.Should().ContainSingle(e => e.GetType() == typeof(CourseTemplateSettingsUpdated));
        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldAddSettings_WhenTheyDoNotExistYet()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            const string settings = "settings";
            const string extraData = "extra data";
            course.TemplateSettings = new Collection<CourseTemplateSettings>();

            //Act
            course.SaveTemplateSettings(template, settings, extraData);

            //Assert
            course.TemplateSettings.Count.Should().Be(1);
            course.TemplateSettings.First().Course.Should().Be(course);
            course.TemplateSettings.First().Template.Should().Be(template);
            course.TemplateSettings.First().Settings.Should().Be(settings);
            course.TemplateSettings.First().ExtraData.Should().Be(extraData);
        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldAddTemplateSettingsUpdatedEvent_WhenSettingsDoNotExistYet()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            const string settings = "settings";
            const string extraData = "extra data";
            course.TemplateSettings = new Collection<CourseTemplateSettings>();

            //Act
            course.SaveTemplateSettings(template, settings, extraData);

            //Assert
            course.Events.Should().ContainSingle(e => e.GetType() == typeof(CourseTemplateSettingsUpdated));
        }

        #endregion

        #region LearningPaths

        [TestMethod]
        public void LearningPaths_ShouldReturnLearningPaths()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var learningPath = LearningPathObjectMother.Create();

            course.LearningPathCollection = new List<LearningPath>()
            {
                learningPath
            };

            //Act
            var result = course.LearningPaths;

            //Assert
            result.Should().Contain(learningPath);
        }

        #endregion

        #region ResetPublicationUrl

        [TestMethod]
        public void ResetPublicationUrl_ShouldSetNullToPublicationUrl()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("publicationUrl");

            //Act
            course.ResetPublicationUrl();

            //Assert
            course.PublicationUrl.Should().Be(null);
        }

        #endregion
    }
}
