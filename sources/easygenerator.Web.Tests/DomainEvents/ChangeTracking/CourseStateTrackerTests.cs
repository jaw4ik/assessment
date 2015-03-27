using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking
{
    [TestClass]
    public class CourseStateTrackerTests
    {
        private CourseStateTracker _tracker;
        private ICourseStateInfoStorage _storage;

        [TestInitialize]
        public void Initialize()
        {
            _storage = Substitute.For<ICourseStateInfoStorage>();
            _tracker = new CourseStateTracker(_storage);
        }

        #region Handle CoursePublishedEvent

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_DoNothing_When_CourseDoesNotHaveUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseStateInfo();
            _storage.GetCourseStateInfo(course).Returns(info);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _storage.DidNotReceive().SaveCourseStateInfo(course, info);
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_SetHasUnpublishedChangesToFalse_When_CourseHasUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseStateInfo(true);
            _storage.GetCourseStateInfo(course).Returns(info);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            info.HasUnpublishedChanges.Should().BeFalse();
        }

        [TestMethod]
        public void Handle_CoursePublishedEvent_Should_SaveCourseState_When_CourseHasUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseStateInfo(true);
            _storage.GetCourseStateInfo(course).Returns(info);

            //Act
            _tracker.Handle(new CoursePublishedEvent(course));

            //Asssert
            _storage.Received().SaveCourseStateInfo(course, info);
        }

        #endregion

        #region Handle CourseChangedEvent

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_DoNothing_When_CourseHasUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseStateInfo(true);
            _storage.GetCourseStateInfo(course).Returns(info);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _storage.DidNotReceive().SaveCourseStateInfo(course, info);
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_SetHasUnpublishedChangesToTrue_When_CourseDoesNotHaveUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseStateInfo();
            _storage.GetCourseStateInfo(course).Returns(info);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            info.HasUnpublishedChanges.Should().BeTrue();
        }

        [TestMethod]
        public void Handle_CourseChangedEvent_Should_SaveCourseState_When_CourseDoesNotHaveUnpublishedChanges()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseStateInfo();
            _storage.GetCourseStateInfo(course).Returns(info);

            //Act
            _tracker.Handle(new CourseChangedEvent(course));

            //Asssert
            _storage.Received().GetCourseStateInfo(course);
        }

        #endregion

        #region Handle CourseDeletedEvent

        [TestMethod]
        public void Handle_CourseDeletedEvent_Should_DeleteStateFromStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseStateInfo();
            _storage.GetCourseStateInfo(course).Returns(info);

            //Act
            _tracker.Handle(new CourseDeletedEvent(course, new List<string>(), "admin"));

            //Asssert
            _storage.Received().RemoveCourseStateInfo(course);
        }

        #endregion

    }
}
