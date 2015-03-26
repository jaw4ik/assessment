
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking;
using easygenerator.Web.InMemoryStorages;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking
{
    [TestClass]
    public class CourseStateStorageTests
    {
        private CourseStateStorage _courseStateStorage;
        private ICourseStateInMemoryStorage _courseStateInMemoryStorage;

        [TestInitialize]
        public void Initialize()
        {
            _courseStateInMemoryStorage = Substitute.For<ICourseStateInMemoryStorage>();
            _courseStateStorage = new CourseStateStorage(_courseStateInMemoryStorage);
        }

        [TestMethod]
        public void GetCourseState_Should_ReturnCourseState_When_StatePresentInMemoryStorage()
        {
            //Arrange
            var state = CourseStateObjectMother.Create();
            _courseStateInMemoryStorage.GetCourseState(state.Course).Returns(state);

            //Act
            var result = _courseStateStorage.GetCourseState(state.Course);

            //Act
            result.Should().Be(state);
        }

        [TestMethod]
        public void GetCourseState_Should_ReturnDefaultCourseState_When_StateIsNotPresentInMemoryStorage()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _courseStateInMemoryStorage.GetCourseState(course).Returns(null as CourseState);

            //Act
            var result = _courseStateStorage.GetCourseState(course);

            //Act
            Assert.IsNotNull(result);
            result.HasUnpublishedChanges.Should().BeFalse();
            result.Course.Should().Be(course);
        }

        [TestMethod]
        public void SaveCourseState_Should_CallInMemoryStorageSaveCourseState()
        {
            //Arrange
            var state = CourseStateObjectMother.Create();

            //Act
            _courseStateStorage.SaveCourseState(state);

            //Act
            _courseStateInMemoryStorage.Received().SaveCourseState(state);
        }

        [TestMethod]
        public void RemoveCourseState_Should_CallInMemoryStorageRemoveCourseState()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _courseStateStorage.RemoveCourseState(course);

            //Act
            _courseStateInMemoryStorage.Received().RemoveCourseState(course);
        }
    }
}
