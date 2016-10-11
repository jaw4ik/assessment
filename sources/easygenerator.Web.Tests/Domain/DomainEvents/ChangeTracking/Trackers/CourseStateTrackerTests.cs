﻿using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;
using easygenerator.Web.Storage;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.ChangeTracking.Trackers
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
        public void Handle_CourseChangedEvent_Should_Not_UpdateChangedOnInInfoStorage_WhenCourseHasNotBeenPublished()
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
        public void Handle_CourseChangedEvent_ShouldNot_RaiseCourseStateUpdatedEvent_WhenCourseHasNotBeenPublished()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(false);
            _stateStorage.IsDirtyForSale(course).Returns(false);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_ShouldNot_SaveState_WhenCourseHasNotBeenPublished()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(false);
            _stateStorage.IsDirtyForSale(course).Returns(false);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _stateStorage.DidNotReceive().MarkAsDirty(course);
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_ShouldUpdateChangedOnInInfoStorage()
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
        public void Handle_CourseChangedEvent_ShouldRaiseCourseStateUpdatedEvent_WhenCourseIsClean()
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
        public void Handle_CourseChangedEvent_ShouldNot_RaiseCourseStateUpdatedEvent_WhenCourseIsDirty()
        {
            //Arrange
            var course = CreatePublishedCourse();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(true);
            _stateStorage.IsDirtyForSale(course).Returns(true);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_ShouldSaveState_WhenCourseIsClean()
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
        public void Handle_CourseChangedEvent_ShouldNot_SaveState_WhenCourseIsDirty()
        {
            //Arrange
            var course = CreatePublishedCourse();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);
            _stateStorage.IsDirty(course).Returns(true);
            _stateStorage.IsDirtyForSale(course).Returns(true);

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
        public void Handle_CourseBuildStartedEvent_ShouldUpdateBuildStartedOnInInfoStorage()
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

        #region Handle CourseScormBuildStartedEvent

        [TestMethod]
        public void Handle_CourseScormBuildStartedEvent_ShouldUpdateBuildForSaleStartedOnInInfoStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(info);

            //Act
            _tracker.Handle(new CourseScormBuildStartedEvent(course));

            //Asssert
            _infoStorage.ReceivedWithAnyArgs().SaveCourseInfo(course, info);
        }

        #endregion

        #region Handle CoursePublishedEvent

        [TestMethod]
        public void Handle_CoursePublishedEvent_ShouldNot_PublishCourseStateChangedEvent_WhenCourseIsClean()
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
        public void Handle_CoursePublishedEvent_ShouldNot_SaveState_WhenCourseIsClean()
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
        public void Handle_CoursePublishedEvent_ShouldPublishCourseStateChangedEvent_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirty(course).Returns(true);
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildStartedOn = DateTime.MinValue, ChangedOn = Now, IsDirtyForSale = true });
            course.UpdatePublicationUrl(null);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _eventPublisher.ShouldPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_ShouldSaveState_WhenCourse_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirty(course).Returns(true);
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildStartedOn = DateTime.MinValue, ChangedOn = Now, IsDirtyForSale = true });
            course.UpdatePublicationUrl(null);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _stateStorage.Received().MarkAsClean(course);
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_ShouldNot_PublishCourseStateChangedEvent_WhenCourseChangedAfterBuildWasStarted()
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
        public void Handle_CoursePublishedEvent_ShouldNot_SaveState_WhenCourseChangedAfterBuildWasStarted()
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
        public void Handle_CoursePublishedEvent_ShouldPublishCourseStateChangedEvent()
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
        public void Handle_CoursePublishedEvent_ShouldSaveState()
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

        #region Handle CoursePublishedForSaleEvent

        [TestMethod]
        public void Handle_CoursePublishedForSaleEvent_ShouldNot_PublishCourseStateChangedEvent_WhenCourseIsClean()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(false);

            //Act
            _tracker.Handle(new CoursePublishedForSaleEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedForSaleEvent_ShouldNot_SaveState_WhenCourseIsClean()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(false);

            //Act
            _tracker.Handle(new CoursePublishedForSaleEvent(course));

            //Asssert
            _stateStorage.DidNotReceiveWithAnyArgs().MarkAsCleanForSale(course);
        }

        [TestMethod]
        public void Handle_CoursePublishedForSaleEvent_ShouldPublishCourseStateChangedEvent_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(true);
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildForSaleStartedOn = DateTime.MinValue, ChangedOn = Now, IsDirty = true });

            //Act
            _tracker.Handle(new CoursePublishedForSaleEvent(course));

            //Asssert
            _eventPublisher.ShouldPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedForSaleEvent_ShouldSaveState_WhenCourse_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(true);
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildForSaleStartedOn = DateTime.MinValue, ChangedOn = Now, IsDirty = true });

            //Act
            _tracker.Handle(new CoursePublishedForSaleEvent(course));

            //Asssert
            _stateStorage.Received().MarkAsCleanForSale(course);
        }

        [TestMethod]
        public void Handle_CoursePublishedForSaleEvent_ShouldNot_PublishCourseStateChangedEvent_WhenCourseChangedAfterBuildWasStarted()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(true);
            course.MarkAsPublishedForSale();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildForSaleStartedOn = DateTime.MinValue, ChangedOn = Now });

            //Act
            _tracker.Handle(new CoursePublishedForSaleEvent(course));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedForSaleEvent_ShouldNot_SaveState_WhenCourseChangedAfterBuildWasStarted()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(true);
            course.MarkAsPublishedForSale();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildForSaleStartedOn = DateTime.MinValue, ChangedOn = Now });

            //Act
            _tracker.Handle(new CoursePublishedForSaleEvent(course));

            //Asssert
            _stateStorage.DidNotReceiveWithAnyArgs().MarkAsCleanForSale(course);
        }

        [TestMethod]
        public void Handle_CoursePublishedForSaleEvent_ShouldPublishCourseStateChangedEvent()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(true);
            course.MarkAsPublishedForSale();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildForSaleStartedOn = Now, ChangedOn = Now });

            //Act
            _tracker.Handle(new CoursePublishedForSaleEvent(course));

            //Asssert
            _eventPublisher.ShouldPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CoursePublishedForSaleEvent_ShouldSaveState()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(true);
            course.MarkAsPublishedForSale();
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo { BuildForSaleStartedOn = Now, ChangedOn = Now });

            //Act
            _tracker.Handle(new CoursePublishedForSaleEvent(course));

            //Asssert
            _stateStorage.Received().MarkAsCleanForSale(course);
        }

        #endregion

        #region Handle CourseDeletedEvent

        [TestMethod]
        public void Handle_CourseDeletedEvent_ShouldDeleteStateFromStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _tracker.Handle(new CourseDeletedEvent(course, new List<string>(), "admin"));

            //Asssert
            _stateStorage.Received().RemoveState(course);
        }

        [TestMethod]
        public void Handle_CourseDeletedEvent_ShouldDeleteInfoFromStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _tracker.Handle(new CourseDeletedEvent(course, new List<string>(), "admin"));

            //Asssert
            _infoStorage.Received().RemoveCourseInfo(course);
        }

        #endregion

        #region Handle CourseProgressedByCoggnoEvent

        [TestMethod]
        public void Handle_CourseProgressedByCoggnoEvent_ShouldNot_PublishCourseStateChangedEvent_WhenCourseIsSuccessfullyProcessed()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _tracker.Handle(new CourseProcessedByCoggnoEvent(course, true));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseProgressedByCoggnoEvent_ShouldNot_PublishCourseStateChangedEvent_WhenCourseIsDirtyForSale()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(true);
            //Act
            _tracker.Handle(new CourseProcessedByCoggnoEvent(course, false));

            //Asssert
            _eventPublisher.ShouldNotPublishEvent<CourseStateChangedEvent>();
        }

        [TestMethod]
        public void Handle_CourseProgressedByCoggnoEvent_ShouldPublishCourseStateChangedEvent_WhenCourseIsNotDirtyForSale()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _stateStorage.IsDirtyForSale(course).Returns(false);
            _infoStorage.GetCourseInfoOrDefault(course).Returns(new CourseInfo()
            {
                IsDirty = true
            });
            //Act
            _tracker.Handle(new CourseProcessedByCoggnoEvent(course, false));

            //Asssert
            _eventPublisher.ShouldPublishEvent<CourseStateChangedEvent>();
            _stateStorage.Received().MarkAsDirty(course);
        }

        #endregion

    }
}