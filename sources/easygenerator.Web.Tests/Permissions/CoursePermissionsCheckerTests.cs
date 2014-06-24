using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Permissions;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;

namespace easygenerator.Web.Tests.Permissions
{
    [TestClass]
    public class CoursePermissionsCheckerTests
    {
        private CoursePermissionsChecker _checker;
        private IUserRepository _userRepository;
        private const string CreatedBy = "creator@user.com";
        private const string Username = "user@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _checker = new CoursePermissionsChecker(_userRepository);
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
        public void HasPermissions_ShouldReturnFalse_WhenUserIsNotCourseOwnerOrCollaborator()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _checker.HasPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnFalse_WhenUserIsCourseCollaboratorAndCourseOwnerHasFreePlan()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.Collaborate(Username, CreatedBy);
            var owner = UserObjectMother.Create();
            owner.DowngradePlanToFree();
            _userRepository.GetUserByEmail(course.CreatedBy).Returns(owner);

            //Act
            var result = _checker.HasPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserIsCourseCollaborator_AndCourseOwnerHasStarterPlan_AndCollaboratorsCountLessThan3()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.Collaborate(Username, CreatedBy);
            var owner = UserObjectMother.Create();

            _userRepository.GetUserByEmail(course.CreatedBy).Returns(owner);

            //Act
            var result = _checker.HasPermissions(Username, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnFalse_WhenUserIsCourseCollaborator_AndCourseOwnerHasStarterPlan_AndCollaboratorsCountMoreThan3()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.Collaborate(Username, CreatedBy);

            course.Collaborate("user1@mail.com", CreatedBy);
            course.Collaborate("user2@mail.com", CreatedBy);
            course.Collaborate("user3@mail.com", CreatedBy);

            var owner = UserObjectMother.Create();

            _userRepository.GetUserByEmail(course.CreatedBy).Returns(owner);

            //Act
            var result = _checker.HasPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
