using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;
using easygenerator.Web.Storage;
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
        public void Handle_CourseChangedEvent_Should__Not_UpdateChangedOnInInfoStorage_WhenCourseHasNotBeenPublished()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _infoStorage.DidNotReceiveWithAnyArgs().SaveCourseInfo(course, info);
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_Not_RaiseCourseStateUpdatedEvent_WhenCourseIsClean()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(false);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_Not_SaveState_WhenCourseIsClean()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(false);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _stateStorage.DidNotReceive().MarkAsDirty(course);
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_UpdateChangedOnInInfoStorage()
        {
            //Arrange
            var course = CreatePublishedCourse();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _infoStorage.ReceivedWithAnyArgs().SaveCourseInfo(course, info);
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_RaiseCourseStateUpdatedEvent_WhenCourseIsClean()
        {
            //Arrange
            var course = CreatePublishedCourse();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(false);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _eventPublisher.ShouldPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_Not_RaiseCourseStateUpdatedEvent_WhenCourseIsDirty()
        {
            //Arrange
            var course = CreatePublishedCourse();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(true);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_SaveState_WhenCourseIsClean()
        {
            //Arrange
            var course = CreatePublishedCourse();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(false);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _stateStorage.Received().MarkAsDirty(course);
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_Not_SaveState_WhenCourseIsDirty()
        {
            //Arrange
            var course = CreatePublishedCourse();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(true);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _stateStorage.DidNotReceiveWithAnyArgs().MarkAsDirty(course);
        }

        private Course CreatePublishedCourse()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl(PublicationUrl);
            return course;
        }

        #endregion

        #region Handle CourseBuildStartedEvent

        [TestMethod]
        public void Handle_CourseBuildStartedEvent_Should_UpdateBuildStartedOnInInfoStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);

            //Act
            _tracker.Handle(new CourseBuildStartedEvent(course));

            //Asssert
            _infoStorage.ReceivedWithAnyArgs().SaveCourseInfo(course, info);
        }

        #endregion

        #region Handle CoursePublishedEvent

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_Not_PublishCourseStateChangedEvent_WhenCourseIsClean()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirty(course).Returns(false);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_Not_SaveState_WhenCourseIsClean()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirty(course).Returns(false);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _stateStorage.DidNotReceiveWithAnyArgs().MarkAsClean(course);
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_PublishCourseStateChangedEvent_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirty(course).Returns(true);
            course.UpdatePublicationUrl(null);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _eventPublisher.ShouldPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_SaveState_WhenCourse_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirty(course).Returns(true);
            course.UpdatePublicationUrl(null);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _stateStorage.Received().MarkAsClean(course);
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_Not_PublishCourseStateChangedEvent_WhenCourseChangedAfterBuildWasStarted()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirty(course).Returns(true);
            course.UpdatePublicationUrl(PublicationUrl);
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildStartedOn = DateTime.MinValue, ChangedOn = Now });

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
            _stateStorage.IsDirty(course).Returns(true);
            course.UpdatePublicationUrl(PublicationUrl);
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildStartedOn = DateTime.MinValue, ChangedOn = Now });

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _stateStorage.DidNotReceiveWithAnyArgs().MarkAsClean(course);
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_PublishCourseStateChangedEvent()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirty(course).Returns(true);
            course.UpdatePublicationUrl(PublicationUrl);
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildStartedOn = Now, ChangedOn = Now });

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
            _stateStorage.IsDirty(course).Returns(true);
            course.UpdatePublicationUrl(PublicationUrl);
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildStartedOn = Now, ChangedOn = Now });

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _stateStorage.Received().MarkAsClean(course);
        }

        #endregion

        #region Handle CourseDeletedEvent

        [TestMethod]
        public void Handle_CourseDeletedEvent_Should_DeleteStateFromStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _tracker.Handle(new CourseDeletedEvent(course, new List<string>(), new List<CourseCollaborator>(),"admin"));

            //Asssert
            _stateStorage.Received().RemoveState(course);
        }

        [TestMethod]
        public void Handle_CourseDeletedEvent_Should_DeleteInfoFromStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _tracker.Handle(new CourseDeletedEvent(course, new List<string>(), new List<CourseCollaborator>(), "admin"));

            //Asssert
            _infoStorage.Received().RemoveCourseInfo(course);
        }

        #endregion

    }
}
