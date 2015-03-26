using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.InMemoryStorages;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace easygenerator.Web.Tests.InMemoryStorages
{
    [TestClass]
    public class CourseStateInMemoryStorageTests
    {
        private CourseStateInMemoryStorage _courseStateStorage;

        [TestInitialize]
        public void Initialize()
        {
            _courseStateStorage = new CourseStateInMemoryStorage();
        }

        [TestMethod]
        public void SaveCourseState_Should_AddAddCourseState_When_CourseStateIsNotPresentInTheCollection()
        {
            //Arrange
            var courseState = CourseStateObjectMother.Create();

            //Act
            _courseStateStorage.SaveCourseState(courseState);


            //Assert
            _courseStateStorage.CourseStates.ElementAt(0).Should().Be(courseState);
        }

        [TestMethod]
        public void SaveCourseState_Should_AddUpdateCourseState_When_CourseStateIsPresentInTheCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var oldCourseState = CourseStateObjectMother.Create(course);
            _courseStateStorage.SaveCourseState(oldCourseState);

            //Act
            var newCourseState = CourseStateObjectMother.Create(course, true);
            _courseStateStorage.SaveCourseState(newCourseState);

            //Assert
            _courseStateStorage.CourseStates.ElementAt(0).Should().Be(newCourseState);
        }

        [TestMethod]
        public void RemoveCourseState_Should_RemoveCourseState()
        {
            //Arrange
            var courseState = CourseStateObjectMother.Create();
            _courseStateStorage.SaveCourseState(courseState);

            //Act
            _courseStateStorage.RemoveCourseState(courseState.Course);

            //Assert
            _courseStateStorage.CourseStates.Count().Should().Be(0);
        }

        [TestMethod]
        public void RemoveCourseState_Should_DoNothing_When_CourseStateIsNotPresentInCollection()
        {
            //Arrange
            var courseState = CourseStateObjectMother.Create();

            //Act
            _courseStateStorage.RemoveCourseState(courseState.Course);

            //Assert
            _courseStateStorage.CourseStates.Count().Should().Be(0);
        }

        [TestMethod]
        public void GetCourseState_Should_ReturnCourseState()
        {
            //Arrange
            var courseState = CourseStateObjectMother.Create();
            _courseStateStorage.SaveCourseState(courseState);

            //Act
            var result = _courseStateStorage.GetCourseState(courseState.Course);

            //Assert
            result.Should().Be(courseState);
        }
    }
}
