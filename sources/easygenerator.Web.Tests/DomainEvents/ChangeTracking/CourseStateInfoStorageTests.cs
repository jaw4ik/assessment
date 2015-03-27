
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
    public class CourseStateInfoStorageTests
    {
        private CourseStateInfoStorage _storage;
        private ICourseStateInfoInMemoryStorage _inMemoryStorage;

        [TestInitialize]
        public void Initialize()
        {
            _inMemoryStorage = Substitute.For<ICourseStateInfoInMemoryStorage>();
            _storage = new CourseStateInfoStorage(_inMemoryStorage);
        }

        [TestMethod]
        public void GetCourseState_Should_ReturnCourseState_When_StatePresentInMemoryStorage()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            _inMemoryStorage.GetCourseStateInfo(course).Returns(info);

            //Act
            var result = _storage.GetCourseStateInfo(course);

            //Act
            result.Should().Be(info);
        }

        [TestMethod]
        public void GetCourseState_Should_ReturnDefaultCourseState_When_StateIsNotPresentInMemoryStorage()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            _inMemoryStorage.GetCourseStateInfo(course).Returns(null as CourseStateInfo);

            //Act
            var result = _storage.GetCourseStateInfo(course);

            //Act
            Assert.IsNotNull(result);
            result.HasUnpublishedChanges.Should().BeFalse();
        }

        [TestMethod]
        public void SaveCourseState_Should_CallInMemoryStorageSaveCourseState()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            _storage.SaveCourseStateInfo(course, info);

            //Act
            _inMemoryStorage.Received().SaveCourseStateInfo(course, info);
        }

        [TestMethod]
        public void RemoveCourseState_Should_CallInMemoryStorageRemoveCourseState()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _storage.RemoveCourseStateInfo(course);

            //Act
            _inMemoryStorage.Received().RemoveCourseStateInfo(course);
        }
    }
}
