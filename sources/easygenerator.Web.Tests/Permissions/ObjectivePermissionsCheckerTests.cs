using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Permissions;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;

namespace easygenerator.Web.Tests.Permissions
{
    [TestClass]
    public class ObjectivePermissionsCheckerTests
    {
        private ObjectivePermissionsChecker _objectivePermissionChecker;
        private IEntityPermissionsChecker<Course> _coursePermissionChecker;
        private const string CreatedBy = "creator@user.com";
        private const string Username = "user@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _coursePermissionChecker = Substitute.For<IEntityPermissionsChecker<Course>>();
            _objectivePermissionChecker = new ObjectivePermissionsChecker(_coursePermissionChecker);
        }

        #region HasPermissions

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserIsObjectiveOwner()
        {
            //Arrange
            var objective = ObjectiveObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _objectivePermissionChecker.HasPermissions(CreatedBy, objective);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserIsObjectiveCourseCollaborator()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var course = Substitute.For<Course>();
            objective.Courses.Returns(new List<Course> { course });
            _coursePermissionChecker.HasPermissions(Username, course).Returns(true);

            //Act
            var result = _objectivePermissionChecker.HasPermissions(Username, objective);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnFalse_WhenUserIsNotObjectiveOwnerOrCourseCollaborator()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var course = CourseObjectMother.Create();
            _coursePermissionChecker.HasPermissions(Username, course).Returns(false);
            objective.Courses.Returns(new List<Course> { course });

            //Act
            var result = _objectivePermissionChecker.HasPermissions(Username, objective);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
