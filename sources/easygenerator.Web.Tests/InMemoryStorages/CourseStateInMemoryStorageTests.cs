using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;
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
            var course = CourseObjectMother.Create();

            //Act
            _courseStateStorage.SaveHasUnpublishedChanges(course, true);

            //Assert
            _courseStateStorage.States.ElementAt(0).Should().Be(true);
        }

        [TestMethod]
        public void SaveCourseState_Should_AddUpdateCourseState_When_CourseStateIsPresentInTheCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _courseStateStorage.SaveHasUnpublishedChanges(course, false);

            //Act
            _courseStateStorage.SaveHasUnpublishedChanges(course, true);

            //Assert
            _courseStateStorage.States.ElementAt(0).Should().Be(true);
        }

        [TestMethod]
        public void TryGetHasUnpublishedChanges_Should_ReturnTrue_When_CourseStateIsPresentInTheCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _courseStateStorage.SaveHasUnpublishedChanges(course, false);
            bool value;

            //Act
            var result = _courseStateStorage.TryGetHasUnpublishedChanges(course, out value);

            //Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void TryGetHasUnpublishedChanges_Should_ReturnFalse_When_CourseStateIsPresentInTheCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            bool value;

            //Act
            var result = _courseStateStorage.TryGetHasUnpublishedChanges(course, out value);

            //Assert
            Assert.IsFalse(result);
        }

        [TestMethod]
        public void TryGetHasUnpublishedChanges_Should_AssingValue_When_CourseStateIsPresentInTheCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            bool value;
            _courseStateStorage.SaveHasUnpublishedChanges(course, true);

            //Act
            var result = _courseStateStorage.TryGetHasUnpublishedChanges(course, out value);

            //Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void TryGetHasUnpublishedChanges_Should_AssingValueToFalse_When_CourseStateIsNotPresentInTheCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            bool value;

            //Act
            var result = _courseStateStorage.TryGetHasUnpublishedChanges(course, out value);

            //Assert
            Assert.IsFalse(result);
        }

        [TestMethod]
        public void RemoveCourseState_Should_RemoveState_WhenIsPresentInCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _courseStateStorage.SaveHasUnpublishedChanges(course, true);

            //Act
           _courseStateStorage.RemoveCourseState(course);

            //Assert
            _courseStateStorage.States.Count().Should().Be(0);
        }

        [TestMethod]
        public void RemoveCourseState_Should_DoNothing_WhenIsNotPresentInCollection()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _courseStateStorage.RemoveCourseState(course);

            //Assert
            _courseStateStorage.States.Count().Should().Be(0);
        }
    }
}
