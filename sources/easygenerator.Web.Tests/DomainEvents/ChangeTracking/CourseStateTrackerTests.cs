using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.DomainEvents.ChangeTracking;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking
{
    [TestClass]
    public class CourseStateTrackerTests
    {
        private CourseStateTracker _tracker;
        private ICourseInfoInMemoryStorage _infoStorage;
        private IDomainEventPublisher _eventPublisher;
        private ICourseStateStorage _stateStorage;
        private DateTime Now = DateTime.Now;
        private const string PublicationUrl = "www.publication.com";

        [TestInitialize]
        public void Initialize()
        {
            _infoStorage = Substitute.For<ICourseInfoInMemoryStorage>();
            _stateStorage = Substitute.For<ICourseStateStorage>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new CourseStateTracker(_stateStorage, _eventPublisher, _infoStorage);

            DateTimeWrapper.Now = () => DateTime.SpecifyKind(Now, DateTimeKind.Unspecified);
        }

        #region Handle CourseChangedEvent

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_UpdateChangedOnInInfoStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfo(course).Returns(info);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _infoStorage.ReceivedWithAnyArgs().SaveCourseInfo(course, info);
        }

        [TestMethod]
        public void
            Handle_CourseChangedEvent_Should_RaiseCourseStateUpdatedEvent_WhenCourseDoesNotHaveUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfo(course).Returns(info);
            _stateStorage.HasUnpublishedChanges(course).Returns(false);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _eventPublisher.ShouldPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_Not_RaiseCourseStateUpdatedEvent_WhenCourse_HasUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfo(course).Returns(info);
            _stateStorage.HasUnpublishedChanges(course).Returns(true);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_SaveState_WhenCourseDoesNotHaveUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfo(course).Returns(info);
            _stateStorage.HasUnpublishedChanges(course).Returns(false);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _stateStorage.Received().SaveHasUnpublishedChanges(course, true);
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_Not_SaveState_WhenCourse_HasUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfo(course).Returns(info);
            _stateStorage.HasUnpublishedChanges(course).Returns(true);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _stateStorage.DidNotReceiveWithAnyArgs().SaveHasUnpublishedChanges(course, true);
        }

        #endregion

        #region Handle CourseBuildStartedEvent

        [TestMethod]
        public void Handle_CourseBuildStartedEvent_Should_UpdateBuildStartedOnInInfoStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfo(course).Returns(info);

            //Act
            _tracker.Handle(new CourseBuildStartedEvent(course));

            //Asssert
            _infoStorage.ReceivedWithAnyArgs().SaveCourseInfo(course, info);
        }

        #endregion

        #region Handle CoursePublishedEvent

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_Not_PublishCourseStateChangedEvent_WhenCourse_DoesntHaveUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.HasUnpublishedChanges(course).Returns(false);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_Not_SaveState_WhenCourse_DoesntHaveUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.HasUnpublishedChanges(course).Returns(false);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _stateStorage.DidNotReceiveWithAnyArgs().SaveHasUnpublishedChanges(course, false);
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_Not_PublishCourseStateChangedEvent_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.HasUnpublishedChanges(course).Returns(true);
            course.UpdatePublicationUrl(null);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_Not_SaveState_WhenCourse_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.HasUnpublishedChanges(course).Returns(true);
            course.UpdatePublicationUrl(null);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _stateStorage.DidNotReceiveWithAnyArgs().SaveHasUnpublishedChanges(course, false);
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_Not_PublishCourseStateChangedEvent_WhenCourseChangedAfterBuildWasStarted()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.HasUnpublishedChanges(course).Returns(true);
            course.UpdatePublicationUrl(PublicationUrl);
            _infoStorage.GetCourseInfo(course).Returns(new CourseInfo { BuildStartedOn = DateTime.MinValue, ChangedOn = Now }); 

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_Not_SaveState_WhenCourse_WhenCourseChangedAfterBuildWasStarted()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.HasUnpublishedChanges(course).Returns(true);
            course.UpdatePublicationUrl(PublicationUrl);
            _infoStorage.GetCourseInfo(course).Returns(new CourseInfo { BuildStartedOn = DateTime.MinValue, ChangedOn = Now }); 

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _stateStorage.DidNotReceiveWithAnyArgs().SaveHasUnpublishedChanges(course, false);
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_PublishCourseStateChangedEvent()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.HasUnpublishedChanges(course).Returns(true);
            course.UpdatePublicationUrl(PublicationUrl);
            _infoStorage.GetCourseInfo(course).Returns(new CourseInfo { BuildStartedOn = Now, ChangedOn = Now }); 

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _eventPublisher.ShouldPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_SaveState()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.HasUnpublishedChanges(course).Returns(true);
            course.UpdatePublicationUrl(PublicationUrl);
            _infoStorage.GetCourseInfo(course).Returns(new CourseInfo { BuildStartedOn = Now, ChangedOn = Now }); 

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _stateStorage.Received().SaveHasUnpublishedChanges(course, false);
        }

        #endregion

        #region Handle CourseDeletedEvent

        [TestMethod]
        public void Handle_CourseDeletedEvent_Should_DeleteStateFromStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _tracker.Handle(new CourseDeletedEvent(course, new List<string>(), "admin"));

            //Asssert
            _stateStorage.Received().RemoveCourseState(course);
        }

        [TestMethod]
        public void Handle_CourseDeletedEvent_Should_DeleteInfoFromStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _tracker.Handle(new CourseDeletedEvent(course, new List<string>(), "admin"));

            //Asssert
            _infoStorage.Received().RemoveCourseInfo(course);
        }

        #endregion

    }
}
