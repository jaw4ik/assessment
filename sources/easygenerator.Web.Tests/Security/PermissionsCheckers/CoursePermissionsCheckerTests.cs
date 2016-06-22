using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Security.PermissionsCheckers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;

namespace easygenerator.Web.Tests.Security.PermissionsCheckers
{
    [TestClass]
    public class CoursePermissionsCheckerTests
    {
        private CoursePermissionsChecker _checker;
        private const string CreatedBy = "creator@user.com";
        private const string Username = "user@user.com";
        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void Initialize()
        {
            _checker = new CoursePermissionsChecker();
            DateTimeWrapper.Now = () => CurrentDate;
        }

        #region HasOwnerPermissions

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnTrue_WhenUserIsOwner()
        {
            //Arrange
            var course = CourseObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _checker.HasOwnerPermissions(CreatedBy, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnFalse_WhenUserIsNotOwner()
        {
            //Arrange
            var course = CourseObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _checker.HasOwnerPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasCollaboratorPermissions

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserIsCourseOwner()
        {
            //Arrange
            var course = CourseObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _checker.HasCollaboratorPermissions(CreatedBy, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_WhenUserIsNotCourseOwnerOrCollaborator()
        {
            //Arrange
            var course = CourseObjectMother.Create(CreatedBy);

            //Act
            var result = _checker.HasCollaboratorPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserIsCollaborator_AndIsAccepted()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.Collaborate(Username, "author");
            var collaborator = course.Collaborators.First();
            course.AcceptCollaboration(collaborator);

            //Act
            var result = _checker.HasCollaboratorPermissions(Username, course);

            //Assert
            result.Should().BeTrue();
        }

        #endregion
    }
}