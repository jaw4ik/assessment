using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.Infrastructure;
using easygenerator.DomainModel.Events.ThemeEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class CourseChangeTrackerTests
    {
        private CourseChangeTracker _tracker;
        private IDomainEventPublisher _publisher;
        private ICourseRepository _repository;
        private IUnitOfWork _unitOfWork;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _repository = Substitute.For<ICourseRepository>();
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _tracker = new CourseChangeTracker(_publisher, _repository, _unitOfWork);
        }

        #region Course event handlers

        [TestMethod]
        public void Handle_CourseTitleUpdated_ShouldPublishCourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTitleUpdatedEvent(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseIntroductionContentUpdated_ShouldPublishCourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseIntroductionContentUpdated(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseTemplateUpdatedEvent_ShouldPublishCourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTemplateUpdatedEvent(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseSectionsReorderedEvent_ShouldPublishCourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseSectionsReorderedEvent(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseSectionRelatedEvent_ShouldPublishCourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseSectionRelatedEvent(CourseObjectMother.Create(), SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseSectionsUnrelatedEvent_ShouldPublishCourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseSectionsUnrelatedEvent(CourseObjectMother.Create(), new[] { SectionObjectMother.Create() }));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseTemplateSettingsUpdated_ShouldPublishCourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTemplateSettingsUpdated(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        #endregion

        [TestMethod]
        public void Handle_SectionChangedEvent_ShouldPublishCourseChangedEvent()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToSection(section.Id).Returns(courses);

            //Act
            _tracker.Handle(new SectionChangedEvent(section));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handle_SectionChangedEvent_ShouldCallSaveMethod()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToSection(section.Id).Returns(courses);

            //Act
            _tracker.Handle(new SectionChangedEvent(section));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_ThemeUpdated_ShouldPublishCourseChangedEvent()
        {
            //Arrange
            var theme = ThemeObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesWithTheme(theme.Id).Returns(courses);

            //Act
            _tracker.Handle(new ThemeUpdatedEvent(theme));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handle_ThemeUpdated_ShouldCallSaveMethod()
        {
            //Arrange
            var theme = ThemeObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesWithTheme(theme.Id).Returns(courses);

            //Act
            _tracker.Handle(new ThemeUpdatedEvent(theme));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_ThemeDeleted_ShouldPublishCourseChangedEvent()
        {
            //Arrange
            var template = TemplateObjectMother.Create();
            var theme = ThemeObjectMother.Create();
            var settings = new[]
            {
                new CourseTemplateSettings() {Course = CourseObjectMother.CreateWithTemplate(template), Template = template},
                new CourseTemplateSettings() {Course = CourseObjectMother.CreateWithTemplate(template)},
            };

            //Act
            _tracker.Handle(new ThemeDeletedEvent(theme, settings));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_ThemeDeleted_ShouldCallSaveMethod()
        {
            //Arrange
            var template = TemplateObjectMother.Create();
            var theme = ThemeObjectMother.Create();
            var settings = new[]
            {
                new CourseTemplateSettings() {Course = CourseObjectMother.CreateWithTemplate(template), Template = template},
                new CourseTemplateSettings() {Course = CourseObjectMother.CreateWithTemplate(template)},
            };

            //Act
            _tracker.Handle(new ThemeDeletedEvent(theme, settings));

            //Assert
            _unitOfWork.Received().Save();
        }
    }
}
