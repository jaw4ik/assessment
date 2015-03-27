using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking;
using easygenerator.Web.InMemoryStorages;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace easygenerator.Web.Tests.InMemoryStorages
{
    [TestClass]
    public class CourseStateInMemoryStorageTests
    {
        private CourseStateInfoInMemoryStorage _courseStateStorage;

        [TestInitialize]
        public void Initialize()
        {
            _courseStateStorage = new CourseStateInfoInMemoryStorage();
        }

        [TestMethod]
        public void SaveCourseStateInfo_Should_AddAddCourseState_When_CourseStateIsNotPresentInTheCollection()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            _courseStateStorage.SaveCourseStateInfo(course, info);


            //Assert
            _courseStateStorage.CourseStateInfos.ElementAt(0).Should().Be(info);
        }

        [TestMethod]
        public void SaveCourseState_Should_AddUpdateCourseState_When_CourseStateIsPresentInTheCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var oldInfo = CourseStateInfoObjectMother.Create();
            _courseStateStorage.SaveCourseStateInfo(course, oldInfo);

            //Act
            var newInfo = CourseStateInfoObjectMother.Create(true);
            _courseStateStorage.SaveCourseStateInfo(course, newInfo);

            //Assert
            _courseStateStorage.CourseStateInfos.ElementAt(0).Should().Be(newInfo);
        }

        [TestMethod]
        public void RemoveCourseState_Should_RemoveCourseState()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            _courseStateStorage.SaveCourseStateInfo(course, info);

            //Act
            _courseStateStorage.RemoveCourseStateInfo(course);

            //Assert
            _courseStateStorage.CourseStateInfos.Count().Should().Be(0);
        }

        [TestMethod]
        public void RemoveCourseState_Should_DoNothing_When_CourseStateIsNotPresentInCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _courseStateStorage.RemoveCourseStateInfo(course);

            //Assert
            _courseStateStorage.CourseStateInfos.Count().Should().Be(0);
        }

        [TestMethod]
        public void GetCourseState_Should_ReturnCourseState()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = CourseStateInfoObjectMother.Create();
            _courseStateStorage.SaveCourseStateInfo(course, info);

            //Act
            var result = _courseStateStorage.GetCourseStateInfo(course);

            //Assert
            result.Should().Be(info);
        }
    }
}
