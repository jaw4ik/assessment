using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.DomainEvents.ChangeTracking.Trackers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Linq;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking.Trackers
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
            ShouldPublishCourseChangedEvent();
        }

        [TestMethod]
        public void Handler_CourseIntroductionContentUpdated_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseIntroductionContentUpdated(CourseObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedEvent();
        }

        [TestMethod]
        public void Handler_CourseTemplateUpdatedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTemplateUpdatedEvent(CourseObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedEvent();
        }

        [TestMethod]
        public void Handler_CourseObjectivesReorderedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseObjectivesReorderedEvent(CourseObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedEvent();
        }

        [TestMethod]
        public void Handler_CourseObjectiveRelatedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseObjectiveRelatedEvent(CourseObjectMother.Create(), ObjectiveObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedEvent();
        }

        [TestMethod]
        public void Handler_CourseObjectivesUnrelatedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseObjectivesUnrelatedEvent(CourseObjectMother.Create(), new[] { ObjectiveObjectMother.Create() }));

            //Assert
            ShouldPublishCourseChangedEvent();
        }

        [TestMethod]
        public void Handler_CourseTemplateSettingsUpdated_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTemplateSettingsUpdated(CourseObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedEvent();
        }

        #endregion

        [TestMethod]
        public void Handler_ObjectiveChangedEvent_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var courses = new[] { CourseObjectMother.Create(), CourseObjectMother.Create() };
            _repository.GetCoursesRelatedToObjective(objective.Id).Returns(courses);

            //Act
            _tracker.Handle(new ObjectiveChangedEvent(objective));

            //Assert
            ShouldPublishCourseChangedEvent(2);
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
            ShouldPublishCourseChangedEvent(2);
        }

        private void ShouldPublishCourseChangedEvent(int eventCount = 1)
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(eventCount);

            for (int i = 0; i < eventCount; i++)
            {
                calls.ElementAtOrDefault(i).GetArguments()[0].Should().BeOfType<CourseChangedEvent>();
            }
        }
    }
}
