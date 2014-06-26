using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
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
        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void Initialize()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _checker = new CoursePermissionsChecker(_userRepository);
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
        public void HasCollaboratorPermissions_ShouldReturnFalse_WhenUserIsCourseCollaborator_AndCourseOwnerHasFreePlan()
        {
            //Arrange
            var course = CourseObjectMother.Create(createdBy: CreatedBy);
            course.Collaborate(Username, CreatedBy);
            var owner = Substitute.For<User>();
            owner.HasPlusAccess().Returns(false);
            owner.HasStarterAccess().Returns(false);
            _userRepository.GetUserByEmail(CreatedBy).Returns(owner);

            //Act
            var result = _checker.HasCollaboratorPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserIsCourseCollaborator_AndCourseOwnerHasStarterPlan_AndCollaboratorsCountLessThanMax()
        {
            //Arrange
            var course = CourseObjectMother.Create(createdBy: CreatedBy);
            course.Collaborate(Username, CreatedBy);
            var owner = Substitute.For<User>();
            owner.HasPlusAccess().Returns(false);
            owner.HasStarterAccess().Returns(true);

            _userRepository.GetUserByEmail(course.CreatedBy).Returns(owner);

            //Act
            var result = _checker.HasCollaboratorPermissions(Username, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_WhenUserIsCourseCollaborator_AndCourseOwnerHasStarterPlan_AndCollaboratorsCountMoreThanMax()
        {
            //Arrange
            var course = CourseObjectMother.Create(createdBy: CreatedBy);
            course.Collaborate(Username, CreatedBy);

            for (var i = 0; i < Constants.Collaboration.MaxCollaboratorsCountForStarterPlan; i++)
            {
                course.Collaborate(String.Format("user{0}@mail.com", i), CreatedBy);
            }

            var owner = UserObjectMother.Create();

            _userRepository.GetUserByEmail(CreatedBy).Returns(owner);

            //Act
            var result = _checker.HasCollaboratorPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserIsCourseCollaborator_AndCourseOwnerHasPlusPlan()
        {
            //Arrange
            var course = CourseObjectMother.Create(createdBy: CreatedBy);
            course.Collaborate(Username, CreatedBy);
            var owner = Substitute.For<User>();
            owner.HasPlusAccess().Returns(true);

            _userRepository.GetUserByEmail(course.CreatedBy).Returns(owner);

            //Act
            var result = _checker.HasCollaboratorPermissions(Username, course);

            //Assert
            result.Should().BeTrue();
        }

        #endregion
    }
}
