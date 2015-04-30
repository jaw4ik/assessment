using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Security.FeatureAvailability;
using easygenerator.Web.Security.PermissionsCheckers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Security.PermissionsCheckers
{
    [TestClass]
    public class CoursePermissionsCheckerTests
    {
        private CoursePermissionsChecker _checker;
        private IFeatureAvailabilityChecker _featureAvailabilityChecker;
        private const string CreatedBy = "creator@user.com";
        private const string Username = "user@user.com";
        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void Initialize()
        {
            _featureAvailabilityChecker = Substitute.For<IFeatureAvailabilityChecker>();
            _checker = new CoursePermissionsChecker(_featureAvailabilityChecker);
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
        public void HasCollaboratorPermissions_ShouldReturnFalse_WhenUserIsCollaboratorButCollaborationDisabled()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var collaborator = Substitute.For<CourseCollaborator>();
            collaborator.Email.Returns(Username);
            course.Collaborators.Returns(new List<CourseCollaborator>() { collaborator });

            _featureAvailabilityChecker.IsCourseCollaborationEnabled(course).Returns(false);

            //Act
            var result = _checker.HasCollaboratorPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserIsCollaborator_AndIsAccepted_AndCollaborationEnabled()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var collaborator = Substitute.For<CourseCollaborator>();
            collaborator.AcceptCollaboration();
            collaborator.Email.Returns(Username);
            course.Collaborators.Returns(new List<CourseCollaborator>() { collaborator });

            _featureAvailabilityChecker.IsCourseCollaborationEnabled(course).Returns(true);

            //Act
            var result = _checker.HasCollaboratorPermissions(Username, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_WhenUserIsCollaborator_AndNotAccepted_AndCollaborationEnabled()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var collaborator = Substitute.For<CourseCollaborator>();
            collaborator.Email.Returns(Username);
            course.Collaborators.Returns(new List<CourseCollaborator>() { collaborator });

            _featureAvailabilityChecker.IsCourseCollaborationEnabled(course).Returns(true);

            //Act
            var result = _checker.HasCollaboratorPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
