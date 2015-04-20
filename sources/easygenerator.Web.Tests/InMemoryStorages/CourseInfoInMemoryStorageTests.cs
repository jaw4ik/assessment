using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace easygenerator.Web.Tests.InMemoryStorages
{
    [TestClass]
    public class CourseInfoInMemoryStorageTests
    {
        private CourseInfoInMemoryStorage _courseStateStorage;

        [TestInitialize]
        public void Initialize()
        {
            _courseStateStorage = new CourseInfoInMemoryStorage();
        }

        [TestMethod]
        public void SaveCourseStateInfo_Should_AddAddCourseState_When_CourseStateIsNotPresentInTheCollection()
        {
            //Arrange
            var info = new CourseInfo();
            var course = CourseObjectMother.Create();

            //Act
            _courseStateStorage.SaveCourseInfo(course, info);


            //Assert
            _courseStateStorage.CourseInfos.ElementAt(0).Should().Be(info);
        }

        [TestMethod]
        public void SaveCourseState_Should_AddUpdateCourseState_When_CourseStateIsPresentInTheCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var oldInfo = new CourseInfo();
            _courseStateStorage.SaveCourseInfo(course, oldInfo);

            //Act
            var newInfo = new CourseInfo();
            _courseStateStorage.SaveCourseInfo(course, newInfo);

            //Assert
            _courseStateStorage.CourseInfos.ElementAt(0).Should().Be(newInfo);
        }

        [TestMethod]
        public void RemoveCourseState_Should_RemoveCourseState()
        {
            //Arrange
            var info = new CourseInfo();
            var course = CourseObjectMother.Create();
            _courseStateStorage.SaveCourseInfo(course, info);

            //Act
            _courseStateStorage.RemoveCourseInfo(course);

            //Assert
            _courseStateStorage.CourseInfos.Count().Should().Be(0);
        }

        [TestMethod]
        public void RemoveCourseState_Should_DoNothing_When_CourseStateIsNotPresentInCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _courseStateStorage.RemoveCourseInfo(course);

            //Assert
            _courseStateStorage.CourseInfos.Count().Should().Be(0);
        }

        [TestMethod]
        public void GetCourseState_Should_ReturnCourseState()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _courseStateStorage.SaveCourseInfo(course, info);

            //Act
            var result = _courseStateStorage.GetCourseInfoOrDefault(course);

            //Assert
            result.Should().Be(info);
        }

        [TestMethod]
        public void GetCourseState_Should_ReturnDefaultCourseState_WhenNotInCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _courseStateStorage.GetCourseInfoOrDefault(course);

            //Assert
            result.Should().BeOfType<CourseInfo>();
        }
    }
}
