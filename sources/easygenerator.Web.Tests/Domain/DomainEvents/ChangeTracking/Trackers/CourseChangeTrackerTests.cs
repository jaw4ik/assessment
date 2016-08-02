using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
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

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _repository = Substitute.For<ICourseRepository>();
            _tracker = new CourseChangeTracker(_publisher, _repository);
        }

        #region Course event handlers

        [TestMethod]
        public void Handler_CourseTitleUpdated_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTitleUpdatedEvent(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handler_CourseIntroductionContentUpdated_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseIntroductionContentUpdated(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handler_CourseTemplateUpdatedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTemplateUpdatedEvent(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handler_CourseSectionsReorderedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseSectionsReorderedEvent(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handler_CourseSectionRelatedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseSectionRelatedEvent(CourseObjectMother.Create(), SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handler_CourseSectionsUnrelatedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseSectionsUnrelatedEvent(CourseObjectMother.Create(), new[] { SectionObjectMother.Create() }));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        [TestMethod]
        public void Handler_CourseTemplateSettingsUpdated_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTemplateSettingsUpdated(CourseObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>();
        }

        #endregion

        [TestMethod]
        public void Handler_SectionChangedEvent_Should_Publish_CourseChangedEvent()
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
        public void Handler_QuestionChangedEvent_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var question = FillInTheBlanksObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToQuestion(question.Id).Returns(courses);

            //Act
            _tracker.Handle(new QuestionChangedEvent(question));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handler_LearningContentChangedEvent_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var content = LearningContentObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToLearningContent(content.Id).Returns(courses);

            //Act
            _tracker.Handle(new LearningContentChangedEvent(content));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handler_AnswerChangedEvent_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var answer = AnswerObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToAnswer(answer.Id).Returns(courses);

            //Act
            _tracker.Handle(new AnswerChangedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handler_DropspotChangedEvent_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var dropspot = DropspotObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToDropspot(dropspot.Id).Returns(courses);

            //Act
            _tracker.Handle(new DropspotChangedEvent(dropspot));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handler_HotSpotPolygonChangedEvent_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var polygon = HotSpotPolygonObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToHotSpotPolygon(polygon.Id).Returns(courses);

            //Act
            _tracker.Handle(new HotSpotPolygonChangedEvent(polygon));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handler_TextMatchingAnswerChanged_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var answer = TextMatchingAnswerObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToTextMatchingAnswer(answer.Id).Returns(courses);

            //Act
            _tracker.Handle(new TextMatchingAnswerChangedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handler_SingleSelectImageAnswerChanged_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var answer = SingleSelectImageAnswerObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToSingleSelectImageAnswer(answer.Id).Returns(courses);

            //Act
            _tracker.Handle(new SingleSelectImageAnswerChangedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handler_RankingTextAnswerTextChanged_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var answer = RankingTextAnswerObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToRankingTextAnswer(answer.Id).Returns(courses);

            //Act
            _tracker.Handle(new RankingTextAnswerTextChangedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handler_RankingTextAnswerCreated_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var answer = RankingTextAnswerObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToRankingTextAnswer(answer.Id).Returns(courses);

            //Act
            _tracker.Handle(new RankingTextAnswerCreatedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<CourseChangedEvent>(2);
        }

        [TestMethod]
        public void Handler_ThemeUpdated_Should_Publish_CourseChangedEvent()
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
        public void Handler_ThemeDeleted_Should_Publish_CourseChangedEvent()
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
    }
}
