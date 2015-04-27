using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Security.PermissionsCheckers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Security.PermissionsCheckers
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

        #region HasOwnerPermissions

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnTrue_WhenUserIsOwner()
        {
            //Arrange
            var course = ObjectiveObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _objectivePermissionChecker.HasOwnerPermissions(CreatedBy, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnFalse_WhenUserIsNotOwner()
        {
            //Arrange
            var course = ObjectiveObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _objectivePermissionChecker.HasOwnerPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasCollaboratorPermissions

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserIsObjectiveOwner()
        {
            //Arrange
            var objective = ObjectiveObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _objectivePermissionChecker.HasCollaboratorPermissions(CreatedBy, objective);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserIsObjectiveCourseCollaborator()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var course = Substitute.For<Course>();
            objective.Courses.Returns(new List<Course> { course });
            _coursePermissionChecker.HasCollaboratorPermissions(Username, course).Returns(true);

            //Act
            var result = _objectivePermissionChecker.HasCollaboratorPermissions(Username, objective);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_WhenUserIsNotObjectiveOwnerOrCourseCollaborator()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var course = CourseObjectMother.Create();
            _coursePermissionChecker.HasCollaboratorPermissions(Username, course).Returns(false);
            objective.Courses.Returns(new List<Course> { course });

            //Act
            var result = _objectivePermissionChecker.HasCollaboratorPermissions(Username, objective);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
