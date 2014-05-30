using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Permissions;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Permissions
{
    [TestClass]
    public class ObjectivePermissionCheckerTests
    {
        private ObjectivePermissionChecker _checker;
        private const string CreatedBy = "creator@user.com";
        private const string Username = "user@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _checker = new ObjectivePermissionChecker();
        }

        #region HasPermissions

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserIsObjectiveOwner()
        {
            //Arrange
            var objective = ObjectiveObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _checker.HasPermissions(CreatedBy, objective);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserIsObjectiveCourseCollaborator()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var course = Substitute.For<Course>();
            var collaborator = CourseCollaboratorObjectMother.Create(course, Username);
            course.Collaborators.Returns(new List<CourseCollaborator>() { collaborator });
            objective.Courses.Returns(new List<Course> {course});

            //Act
            var result = _checker.HasPermissions(Username, objective);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnFalse_WhenUserIsNotObjectiveOwnerOrCourseCollaborator()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            var result = _checker.HasPermissions(Username, objective);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
