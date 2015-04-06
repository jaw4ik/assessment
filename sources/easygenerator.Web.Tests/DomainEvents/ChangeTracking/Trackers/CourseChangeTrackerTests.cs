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
            ShouldPublishCourseChangedevent();
        }

        [TestMethod]
        public void Handler_CourseIntroductionContentUpdated_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseIntroductionContentUpdated(CourseObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedevent();
        }

        [TestMethod]
        public void Handler_CourseTemplateUpdatedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTemplateUpdatedEvent(CourseObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedevent();
        }

        [TestMethod]
        public void Handler_CourseObjectivesReorderedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseObjectivesReorderedEvent(CourseObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedevent();
        }

        [TestMethod]
        public void Handler_CourseObjectiveRelatedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseObjectiveRelatedEvent(CourseObjectMother.Create(), ObjectiveObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedevent();
        }

        [TestMethod]
        public void Handler_CourseObjectivesUnrelatedEvent_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseObjectivesUnrelatedEvent(CourseObjectMother.Create(), new[] { ObjectiveObjectMother.Create() }));

            //Assert
            ShouldPublishCourseChangedevent();
        }

        [TestMethod]
        public void Handler_CourseTemplateSettingsUpdated_Should_Publish_CourseChangedEvent()
        {
            //Act
            _tracker.Handle(new CourseTemplateSettingsUpdated(CourseObjectMother.Create()));

            //Assert
            ShouldPublishCourseChangedevent();
        }

        #endregion

        [TestMethod]
        public void Handler_ObjectiveChangedEvent_Should_Publish_CourseChangedEvent()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var courses = new[] {CourseObjectMother.Create(), CourseObjectMother.Create()};
            _repository.GetObjectiveCourses(objective.Id).Returns(courses);

            //Act
            _tracker.Handle(new ObjectiveChangedEvent(objective));

            //Assert
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(2);
            calls.ElementAtOrDefault(0).GetArguments()[0].Should().BeOfType<CourseChangedEvent>();
            calls.ElementAtOrDefault(1).GetArguments()[0].Should().BeOfType<CourseChangedEvent>();
        }

        private void ShouldPublishCourseChangedevent()
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(1);
            calls.First().GetArguments()[0].Should().BeOfType<CourseChangedEvent>();
        }
    }
}
