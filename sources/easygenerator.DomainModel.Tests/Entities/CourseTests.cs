using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CommentEvents;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.CourseEvents.Collaboration;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
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
            course.RelatedSections.Should().BeEmpty();
            course.CommentsCollection.Should().BeEmpty();
            course.CollaboratorsCollection.Should().BeEmpty();
            course.TemplateSettings.Should().BeEmpty();
            course.CreatedBy.Should().Be(CreatedBy);
            course.ModifiedBy.Should().Be(CreatedBy);
            course.IntroductionContent.Should().BeNull();
            course.SectionsOrder.Should().BeNull();
            course.CourseCompanies.Should().BeEmpty();
            course.SaleInfo.Course_Id.Should().Be(course.Id);
            course.QuestionShortIdsInfo.Course_Id.Should().Be(course.Id);
        }

        #endregion

        #region RelateSection

        [TestMethod]
        public void RelateSection_ShouldThrowNullArgumentException_WhenSectionIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.RelateSection(null, null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("section");
        }

        [TestMethod]
        public void RelateSection_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            course.RelateSection(section, null, ModifiedBy);

            //Assert
            course.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void RelateSection_ShouldRelateSectionToCourse()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            course.RelateSection(section, null, ModifiedBy);

            //Assert
            course.RelatedSections.Should().Contain(section);
        }

        [TestMethod]
        public void RelateSection_ShouldUpdateSectionsOrderedListAndInsertToEnd()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var section = SectionObjectMother.Create();
            var section1 = SectionObjectMother.Create();
            course.RelatedSectionsCollection = new Collection<Section>()
            {
                section
            };
            var sectionCollection = new List<Section>() { section };
            course.UpdateSectionsOrder(sectionCollection, ModifiedBy);
            sectionCollection.Add(section1);
            var result = String.Join(",", sectionCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            course.RelateSection(section1, null, ModifiedBy);

            //Assert
            course.SectionsOrder.Should().Be(result);
        }

        [TestMethod]
        public void RelateSection_ShouldUpdateSectionsOrderedListAndInsertToPosition()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var section = SectionObjectMother.Create();
            var section1 = SectionObjectMother.Create();
            var section2 = SectionObjectMother.Create();
            const int position = 1;
            course.RelatedSectionsCollection = new Collection<Section>()
            {
                section,
                section1
            };
            var sectionCollection = new List<Section>() { section, section1 };
            course.UpdateSectionsOrder(sectionCollection, ModifiedBy);
            sectionCollection.Insert(position, section2);
            var result = String.Join(",", sectionCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            course.RelateSection(section2, 1, ModifiedBy);

            //Assert
            course.SectionsOrder.Should().Be(result);
        }

        [TestMethod]
        public void RelateSection_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();

            Action action = () => course.RelateSection(section, null, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RelateSection_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();

            Action action = () => course.RelateSection(section, null, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RelateSection_ShouldUpdateMoidifiedBy()
        {
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();
            var user = "Some user";

            course.RelateSection(section, null, user);

            course.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void RelateSection_ShouldAddCourseSectionRelatedEvent()
        {
            var course = CourseObjectMother.Create();

            course.RelateSection(SectionObjectMother.Create(), null, "user");

            course.ShouldContainSingleEventOfType<CourseSectionRelatedEvent>();
        }

        #endregion

        #region UnrelateSection

        [TestMethod]
        public void UnrelateSection_ShouldThrowNullArgumentException_WhenSectionIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.UnrelateSection(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("section");
        }

        [TestMethod]
        public void UnrelateSection_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateSection(section, null, ModifiedBy);
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            course.UnrelateSection(section, ModifiedBy);

            //Assert
            course.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void UnrelateSection_ShouldUnrelateSectionFromCourse()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateSection(section, null, ModifiedBy);

            //Act
            course.UnrelateSection(section, ModifiedBy);

            //Assert
            course.RelatedSections.Should().NotContain(section);
        }

        [TestMethod]
        public void UnrelateSection_ShouldUpdateSectionsOrderedList()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var section = SectionObjectMother.Create();
            course.RelatedSectionsCollection = new Collection<Section>()
            {
                section
            };
            var sectionCollection = new List<Section>() { section };
            course.UpdateSectionsOrder(sectionCollection, ModifiedBy);
            //Act
            course.UnrelateSection(section, ModifiedBy);

            //Assert
            course.SectionsOrder.Should().Be(null);
        }

        [TestMethod]
        public void UnrelateSection_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateSection(section, null, ModifiedBy);

            Action action = () => course.UnrelateSection(section, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UnrelateSection_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateSection(section, null, ModifiedBy);

            Action action = () => course.UnrelateSection(section, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UnrelateSection_ShouldUpdateMoidifiedBy()
        {
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateSection(section, null, ModifiedBy);
            var user = "Some user";

            course.UnrelateSection(section, user);

            course.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UnrelateSection_ShouldAddCourseSectionRelatedEvent()
        {
            var section = SectionObjectMother.Create();
            var course = CourseObjectMother.Create();
            course.RelateSection(section, null, ModifiedBy);

            course.UnrelateSection(section, "user");

            course.ShouldContainSingleEventOfType<CourseSectionsUnrelatedEvent>();
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

            course.ShouldContainSingleEventOfType<CourseTitleUpdatedEvent>();
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

            course.ShouldContainSingleEventOfType<CourseTemplateUpdatedEvent>();
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

            course.ShouldContainSingleEventOfType<CoursePublishedEvent>();
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

            course.ShouldContainSingleEventOfType<CourseIntroductionContentUpdated>();
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

            course.ShouldContainSingleEventOfType<CourseCollaboratorAddedEvent>();
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

        #region CollaborateAsAdmin

        [TestMethod]
        public void CollaborateAsAdmin_ShouldThrowArgumentNullException_WhenUserEmailIsNull()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.CollaborateAsAdmin(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("userEmail");
        }

        [TestMethod]
        public void CollaborateAsAdmin_ShouldThrowArgumentNullException_WhenUserEmailIsNInvalid()
        {
            var course = CourseObjectMother.Create();

            Action action = () => course.CollaborateAsAdmin("email");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("userEmail");
        }

        [TestMethod]
        public void CollaborateAsAdmin_ShouldNotAddCollaborator_WhenUserIsCourseOwner()
        {
            var course = CourseObjectMother.CreateWithCreatedBy(UserEmail);

            course.CollaborateAsAdmin(UserEmail);

            course.CollaboratorsCollection.Should().BeEmpty();
        }

        [TestMethod]
        public void CollaborateAsAdmin_ShouldGrantAdminAccess_WhenCollaboratorExists()
        {
            var course = CourseObjectMother.Create(UserEmail);
            course.Collaborate(UserEmail, CreatedBy);

            course.CollaborateAsAdmin(UserEmail);

            course.CollaboratorsCollection.First().IsAdmin.Should().BeTrue();
        }

        [TestMethod]
        public void CollaborateAsAdmin_ShouldAcceptCollaboration_WhenCollaboratorExists()
        {
            var course = CourseObjectMother.Create(UserEmail);
            course.Collaborate(UserEmail, CreatedBy);

            course.CollaborateAsAdmin(UserEmail);

            course.CollaboratorsCollection.First().IsAccepted.Should().BeTrue();
        }

        [TestMethod]
        public void CollaborateAsAdmin_ShouldAddCollaborator()
        {
            const string owner = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: owner);

            course.CollaborateAsAdmin(UserEmail);

            course.CollaboratorsCollection.Should().NotBeEmpty().And.HaveCount(1);
        }

        [TestMethod]
        public void CollaborateAsAdmin_ShouldReturnCourseCollaborator()
        {
            const string owner = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: owner);

            var result = course.CollaborateAsAdmin(UserEmail);

            result.Should().BeOfType<CourseCollaborator>();
        }

        [TestMethod]
        public void CollaborateAsAdmin_ShouldAddCourseCollaboratorAddedEvent()
        {
            const string email = "owner@www.com";
            var course = CourseObjectMother.Create(createdBy: UserEmail);
            course.CollaborateAsAdmin(email);

            course.ShouldContainSingleEventOfType<CourseCollaboratorAddedEvent>();
        }

        [TestMethod]
        public void CollaborateAsAdmin_ShouldGrantTemplateAccessToCollaborator()
        {
            const string email = "owner@www.com";
            var template = Substitute.For<Template>();
            var course = CourseObjectMother.CreateWithTemplate(template);
            course.CollaborateAsAdmin(email);

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

        [TestMethod]
        public void DeleteComment_ShouldAddCommentCreatedvent()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var comment = CommentObjectMother.Create();

            // Act
            course.AddComment(comment);

            // Assert
            course.ShouldContainSingleEventOfType<CommentCreatedEvent>();
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
            course.ShouldContainSingleEventOfType<CommentDeletedEvent>();
        }

        #endregion

        #region UpdateSectionsOrder

        [TestMethod]
        public void UpdateSectionsOrder_ShouldUpdateSectionsOrderedList()
        {
            //Arrange
            var user = "some user";
            var course = CourseObjectMother.Create();
            var section = SectionObjectMother.Create();
            var section1 = SectionObjectMother.Create();
            var sectionCollection = new List<Section>()
            {
                section,
                section1
            };
            var result = String.Join(",", sectionCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            course.UpdateSectionsOrder(sectionCollection, user);

            //Assert
            course.SectionsOrder.Should().Be(result);
        }

        [TestMethod]
        public void UpdateSectionsOrder_ShouldUpdateModificationDate()
        {
            //Arrange
            var user = "some user";
            DateTimeWrapper.Now = () => DateTime.Now;
            var course = CourseObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(1);
            DateTimeWrapper.Now = () => dateTime;
            var sectionCollection = new List<Section>()
            {
                SectionObjectMother.Create()
            };

            //Act
            course.UpdateSectionsOrder(sectionCollection, user);

            //Assert
            course.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateSectionsOrder_ShouldUpdateModifiedBy()
        {
            //Arrange
            var user = "some user";
            var course = CourseObjectMother.Create();
            var sectionCollection = new List<Section>()
            {
                SectionObjectMother.Create()
            };
            //Act
            course.UpdateSectionsOrder(sectionCollection, user);

            //Assert
            course.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateSectionsOrder_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var sectionCollection = new List<Section>()
            {
                SectionObjectMother.Create()
            };

            //Act
            Action action = () => course.UpdateSectionsOrder(sectionCollection, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateSectionsOrder_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var sectionCollection = new List<Section>()
            {
                SectionObjectMother.Create()
            };

            //Act
            Action action = () => course.UpdateSectionsOrder(sectionCollection, "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateSectionsOrder_ShouldAddCourseSectionsReorderedEvent()
        {
            var section = SectionObjectMother.Create();

            var course = CourseObjectMother.Create();
            course.RelatedSectionsCollection.Add(section);

            course.UpdateSectionsOrder(new Collection<Section> { section }, "user");

            course.ShouldContainSingleEventOfType<CourseSectionsReorderedEvent>();
        }

        #endregion UpdateSectionsOrder

        #region RelatedSections

        [TestMethod]
        public void RelatedSections_ShouldReturnOrderedSectionsCollection_WhenSectionsOrderedListNotNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var section1 = SectionObjectMother.Create();
            var section2 = SectionObjectMother.Create();
            course.RelatedSectionsCollection = new Collection<Section>()
            {
                section2,
                section1
            };
            course.SectionsOrder = String.Format("{0},{1}", section1.Id, section2.Id);

            //Act
            var result = course.RelatedSections;

            //Assert
            result.First().Id.Should().Be(section1.Id);
        }

        [TestMethod]
        public void RelatedSections_ShouldReturnAllSectionsInCorrectOrder_WhenSectionsOrderedListIsNotFull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var section1 = SectionObjectMother.Create();
            var section2 = SectionObjectMother.Create();
            course.RelatedSectionsCollection = new Collection<Section>()
            {
                section2,
                section1
            };
            course.SectionsOrder = section1.Id.ToString();

            //Act
            var result = course.RelatedSections;

            //Assert
            result.Count().Should().Be(2);
            result.First().Should().Be(section1);
        }

        [TestMethod]
        public void RelatedSections_ShouldReturnAllSectionsInCorrectOrder_WhenSectionsOrderedListIsOverfull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var section1 = SectionObjectMother.Create();
            var section2 = SectionObjectMother.Create();
            course.RelatedSectionsCollection = new Collection<Section>()
            {
                section2
            };
            course.SectionsOrder = String.Format("{0},{1}", section1.Id, section2.Id);

            //Act
            var result = course.RelatedSections;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(section2);
        }

        #endregion RelatedSections

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
            course.ShouldContainSingleEventOfType<CourseCollaboratorRemovedEvent>();
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
            var section = SectionObjectMother.Create(createdBy: email);
            var clonedSection = SectionObjectMother.Create(createdBy: email);

            var section2 = SectionObjectMother.Create(createdBy: email);
            var clonedSection2 = SectionObjectMother.Create(createdBy: email);

            _cloner.Clone(Arg.Is<Section>(i => i.Id == section.Id), Arg.Any<object>()).Returns(clonedSection);
            _cloner.Clone(Arg.Is<Section>(i => i.Id == section2.Id), Arg.Any<object>()).Returns(clonedSection2);

            course.RelateSection(section, null, email);
            course.RelateSection(section2, null, email);
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert
            var raisedEvent = course.GetSingleEventOfType<CourseSectionsClonedEvent>();
            raisedEvent.Should().NotBeNull();

            raisedEvent.Course.Should().Be(course);
            raisedEvent.ReplacedSections.Count.Should().Be(2);
            raisedEvent.ReplacedSections.ContainsKey(section.Id).Should().Be(true);
            raisedEvent.ReplacedSections.ContainsKey(section2.Id).Should().Be(true);
            raisedEvent.ReplacedSections[section.Id].Should().Be(clonedSection);
            raisedEvent.ReplacedSections[section2.Id].Should().Be(clonedSection2);

            var nextEvent = course.DequeueEvent();
            nextEvent.Should().BeNull();
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldRaiseEventOnlyAboutSectionsOfRemovedCollaborator()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            var section = SectionObjectMother.Create(createdBy: email);
            var clonedSection = SectionObjectMother.Create(createdBy: email);

            var section2 = SectionObjectMother.Create(createdBy: "another creator");
            var clonedSection2 = SectionObjectMother.Create(createdBy: email);

            _cloner.Clone(Arg.Is<Section>(i => i.Id == section.Id), Arg.Any<object>()).Returns(clonedSection);
            _cloner.Clone(Arg.Is<Section>(i => i.Id == section2.Id), Arg.Any<object>()).Returns(clonedSection2);

            course.RelateSection(section, null, email);
            course.RelateSection(section2, null, email);
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert            
            var raisedEvent = course.GetSingleEventOfType<CourseSectionsClonedEvent>();
            raisedEvent.Should().NotBeNull();

            raisedEvent.Course.Should().Be(course);
            raisedEvent.ReplacedSections.Count.Should().Be(1);
            raisedEvent.ReplacedSections.ContainsKey(section.Id).Should().Be(true);
            raisedEvent.ReplacedSections[section.Id].Should().Be(clonedSection);

            var nextEvent = course.DequeueEvent();
            nextEvent.Should().BeNull();
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldReplaceSectionsOfCollaboratorWithClonedSections()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            var section = SectionObjectMother.Create(createdBy: email);
            var clonedSection = SectionObjectMother.Create(createdBy: email);

            _cloner.Clone(Arg.Is<Section>(i => i.Id == section.Id), Arg.Any<object>()).Returns(clonedSection);
            course.RelateSection(section, null, email);
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert
            course.RelatedSectionsCollection.ElementAt(0).Should().Be(clonedSection);
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldOrderClonedSectionsInSameOrderAsOriginal()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var email = "eguser2@easygenerator.com";
            var section = SectionObjectMother.Create(createdBy: email);
            var clonedSection = SectionObjectMother.Create(createdBy: email);

            var section2 = SectionObjectMother.Create(createdBy: email);
            var clonedSection2 = SectionObjectMother.Create(createdBy: email);

            _cloner.Clone(Arg.Is<Section>(i => i.Id == section.Id), Arg.Any<object>()).Returns(clonedSection);
            _cloner.Clone(Arg.Is<Section>(i => i.Id == section2.Id), Arg.Any<object>()).Returns(clonedSection2);

            course.RelateSection(section, null, email);
            course.RelateSection(section2, 0, email);
            course.Collaborate(email, "createdBy");

            // Act
            course.RemoveCollaborator(_cloner, email);

            // Assert
            course.SectionsOrder.Should().Be(clonedSection2.Id + "," + clonedSection.Id);
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
            course.ShouldContainSingleEventOfType<CollaborationInviteAcceptedEvent>();
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
            course.ShouldContainSingleEventOfType<CollaborationInviteDeclinedEvent>();
        }

        #endregion

        #region OrderClonedSections

        [TestMethod]
        public void OrderClonedSections_ShouldReturnNull_IfClonedSectionsAreNull()
        {
            var course = CourseObjectMother.Create();

            var result = course.OrderClonedSections(null);
            result.Should().BeNull();
        }

        [TestMethod]
        public void OrderClonedSections_ShouldThrowArgumentException_IfLengthOfSectionCollectionsAreDifferent()
        {
            var course = CourseObjectMother.Create();
            Action action = () => course.OrderClonedSections(new Collection<Section> { SectionObjectMother.Create() });
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("clonedSections");
        }

        [TestMethod]
        public void OrderClonedSections_ShouldOrderClonedSectionsAccordingToCourseSections()
        {
            var section1 = SectionObjectMother.Create("section 1");
            var section2 = SectionObjectMother.Create("section 2");
            var section3 = SectionObjectMother.Create("section 3");

            var clonedSection1 = SectionObjectMother.Create("cloned section 1");
            var clonedSection2 = SectionObjectMother.Create("cloned section 2");
            var clonedSection3 = SectionObjectMother.Create("cloned section 3");

            var course = CourseObjectMother.Create();
            course.RelateSection(section1, null, "owner");
            course.RelateSection(section2, null, "owner");
            course.RelateSection(section3, null, "owner");
            course.UpdateSectionsOrder(new Collection<Section> { section3, section1, section2 }, "owner");

            var result = course.OrderClonedSections(new Collection<Section> { clonedSection1, clonedSection2, clonedSection3 });

            result[0].Should().Be(clonedSection3);
            result[1].Should().Be(clonedSection1);
            result[2].Should().Be(clonedSection2);
        }

        #endregion

        #region Sale info

        [TestMethod]
        public void MarkAsPublishedForSale_ShouldSetIsProcessingToTrue()
        {
            var course = CourseObjectMother.Create();

            course.MarkAsPublishedForSale();

            course.SaleInfo.IsProcessing.Should().BeTrue();
        }

        [TestMethod]
        public void MarkAsPublishedForSale_ShouldSetPublishedOn()
        {
            var course = CourseObjectMother.Create();

            course.MarkAsPublishedForSale();

            course.SaleInfo.PublishedOn.Should().Be(_currentDate);
        }

        [TestMethod]
        public void MarkAsPublishedForSale_ShouldRaiseCoursePublishedForSaleEvent()
        {
            var course = CourseObjectMother.Create();

            course.MarkAsPublishedForSale();

            var raisedEvent = course.GetSingleEventOfType<CoursePublishedForSaleEvent>();
            raisedEvent.Should().NotBeNull();

            raisedEvent.Course.Should().Be(course);
        }

        [TestMethod]
        public void UpdateDocumentIdForSale_ShouldSetIsProcessingToFalse()
        {
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();

            course.UpdateDocumentIdForSale("12345");

            course.SaleInfo.IsProcessing.Should().BeFalse();
        }

        [TestMethod]
        public void UpdateDocumentIdForSale_ShouldUpdateDocumentId()
        {
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();

            course.UpdateDocumentIdForSale("12345");

            course.SaleInfo.DocumentId.Should().Be("12345");
        }

        [TestMethod]
        public void UpdateDocumentIdForSale_ShouldRaiseCourseProcessedByCoggnoEvent()
        {
            var course = CourseObjectMother.Create();

            course.MarkAsPublishedForSale();

            course.UpdateDocumentIdForSale("12345");
            var raisedEvent = course.GetSingleEventOfType<CourseProcessedByCoggnoEvent>();
            raisedEvent.Should().NotBeNull();

            raisedEvent.Course.Should().Be(course);
            raisedEvent.Success.Should().BeTrue();
        }

        [TestMethod]
        public void ProcessingForSaleFailed_ShouldSetIsProcessingToFalse()
        {
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();

            course.ProcessingForSaleFailed();

            course.SaleInfo.IsProcessing.Should().BeFalse();
        }

        [TestMethod]
        public void ProcessingForSaleFailed_ShouldRaiseCourseProcessedByCoggnoEvent()
        {
            var course = CourseObjectMother.Create();

            course.MarkAsPublishedForSale();

            course.ProcessingForSaleFailed();
            var raisedEvent = course.GetSingleEventOfType<CourseProcessedByCoggnoEvent>();
            raisedEvent.Should().NotBeNull();

            raisedEvent.Course.Should().Be(course);
            raisedEvent.Success.Should().BeFalse();
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

        #region GetTemplateTheme

        [TestMethod]
        public void GetTemplateTheme_ShouldThrowArgumentNullException_WhenTemplateIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.GetTemplateTheme(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void GetTemplateTheme_ShouldReturnNull_WhenThereAreNoThemeForCurrentTemplate()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.TemplateSettings = new List<CourseTemplateSettings>();

            //Act
            var settings = course.GetTemplateTheme(TemplateObjectMother.Create());

            //Assert
            settings.Should().BeNull();
        }

        [TestMethod]
        public void GetTemplateTheme_ShouldReturnTheme()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            var theme = ThemeObjectMother.Create(template);
            course.TemplateSettings = new List<CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, "", "", theme)
            };

            //Act
            var data = course.GetTemplateTheme(template);

            //Assert
            data.Should().Be(theme);
        }

        #endregion

        #region GetTemplateThemeSettings

        [TestMethod]
        public void GetTemplateThemeSettings_ShouldThrowArgumentNullException_WhenTemplateIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.GetTemplateThemeSettings(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void GetTemplateThemeSettings_ShouldReturnNull_WhenThereAreNoThemeForCurrentTemplate()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.TemplateSettings = new List<CourseTemplateSettings>();

            //Act
            var settings = course.GetTemplateThemeSettings(TemplateObjectMother.Create());

            //Assert
            settings.Should().BeNull();
        }

        [TestMethod]
        public void GetTemplateThemeSettings_ShouldReturnThemeSettings()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            var themeSettings = "Theme settings";
            var theme = ThemeObjectMother.Create(template, "Theme name", themeSettings);
            course.TemplateSettings = new List<CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, "", "", theme)
            };

            //Act
            var data = course.GetTemplateThemeSettings(template);

            //Assert
            data.Should().Be(themeSettings);
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
            course.ShouldContainSingleEventOfType<CourseTemplateSettingsUpdated>();
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
            course.ShouldContainSingleEventOfType<CourseTemplateSettingsUpdated>();
        }

        #endregion

        #region AddTemplateTheme

        [TestMethod]
        public void AddTemplateTheme_ShouldThrowArgumentNullException_WhenTemplateIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => course.AddTemplateTheme(null, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void AddTemplateTheme_ShouldThrowArgumentNullException_WhenThemeIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();

            //Act
            Action action = () => course.AddTemplateTheme(template, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("theme");
        }

        [TestMethod]
        public void AddTemplateTheme_ShouldUpdateSettings_WhenTheyAlreadyExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            var theme = ThemeObjectMother.Create();
            course.TemplateSettings = new Collection<CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, "settings", "extra data")
            };

            //Act
            course.AddTemplateTheme(template, theme);

            //Assert
            course.TemplateSettings.Count.Should().Be(1);
            course.TemplateSettings.First().Theme.Should().Be(theme);
        }

        [TestMethod]
        public void AddTemplateTheme_ShouldAddTemplateSettingsUpdatedEvent_WhenSettingsTheyAlreadyExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            var theme = ThemeObjectMother.Create();
            course.TemplateSettings = new Collection<CourseTemplateSettings>()
            {
                CourseTemplateSettingsObjectMother.Create(course, template, "previous settings", "previous extra data")
            };

            //Act
            course.AddTemplateTheme(template, theme);

            //Assert
            course.ShouldContainSingleEventOfType<CourseTemplateSettingsUpdated>();
        }

        [TestMethod]
        public void AddTemplateTheme_ShouldAddSettings_WhenTheyDoNotExistYet()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            var theme = ThemeObjectMother.Create();
            course.TemplateSettings = new Collection<CourseTemplateSettings>();

            //Act
            course.AddTemplateTheme(template, theme);

            //Assert
            course.TemplateSettings.Count.Should().Be(1);
            course.TemplateSettings.First().Course.Should().Be(course);
            course.TemplateSettings.First().Template.Should().Be(template);
            course.TemplateSettings.First().Theme.Should().Be(theme);
        }

        [TestMethod]
        public void AddTemplateTheme_ShouldAddTemplateSettingsUpdatedEvent_WhenSettingsDoNotExistYet()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            var theme = ThemeObjectMother.Create();
            course.TemplateSettings = new Collection<CourseTemplateSettings>();

            //Act
            course.AddTemplateTheme(template, theme);

            //Assert
            course.ShouldContainSingleEventOfType<CourseTemplateSettingsUpdated>();
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

        #region External publish

        [TestMethod]
        public void Companies_ShouldReturnCourseCompanies()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var company = CompanyObjectMother.Create();

            course.CourseCompanies = new List<Company>()
            {
                company
            };

            //Act
            var result = course.Companies;

            //Assert
            result.Should().Contain(company);
        }

        [TestMethod]
        public void IsPublishedToAnyExternalLms_ShouldReturnTrue_WhenCourseHasCompanies()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var company = CompanyObjectMother.Create();

            course.CourseCompanies = new List<Company>()
            {
                company
            };

            //Act
            var result = course.IsPublishedToAnyExternalLms();

            //Assert
            result.Should().Be(true);
        }

        [TestMethod]
        public void IsPublishedToAnyExternalLms_ShouldReturnFalse_WhenCourseHasNotCompanies()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = course.IsPublishedToAnyExternalLms();

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void SetPublishedToExternalLms_ShouldAddCompanyToCollection_WhenCourseDoesNotContainThisCompany()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var company = CompanyObjectMother.Create();
            //Act
            course.SetPublishedToExternalLms(company);

            //Assert
            course.Companies.Should().Contain(company);
        }

        #endregion
    }
}