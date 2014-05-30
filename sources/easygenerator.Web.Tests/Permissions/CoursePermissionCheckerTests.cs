using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Permissions;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.Permissions
{
    [TestClass]
    public class CoursePermissionCheckerTests
    {
        private CoursePermissionChecker _checker;
        private const string CreatedBy = "creator@user.com";
        private const string Username = "user@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _checker = new CoursePermissionChecker();
        }

        #region HasPermissions

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserIsCourseOwner()
        {
            //Arrange
            var course = CourseObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _checker.HasPermissions(CreatedBy, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserIsCourseCollaborator()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.Collaborate(Username, CreatedBy);

            //Act
            var result = _checker.HasPermissions(Username, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnFalse_WhenUserIsNotCourseOwnerOrCollaborator()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _checker.HasPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
