using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Security.FeatureAvailability;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Security.FeatureAvailability
{
    [TestClass]
    public class FeatureAvailabilityCheckerTests
    {
        private IFeatureAvailabilityChecker _checker;
        private IUserRepository _userRepository;
        private readonly string CreatedBy = "creator@easygenerator.com";
        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void Initialize()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _checker = new FeatureAvailabilityChecker(_userRepository);
            DateTimeWrapper.Now = () => CurrentDate;
        }

        #region GetCourseMaxAllowedCollaboratorsAmount

        [TestMethod]
        public void GetCourseMaxAllowedCollaboratorsAmount_ShouldReturnMaxValue_WhenCourseOwnerHasPlusPlan()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(CreatedBy).ReturnsForAnyArgs(user);

            user.HasPlusAccess().Returns(true);

            //Act
            var result = _checker.GetCourseMaxAllowedCollaboratorsAmount(course);

            //Assert
            result.Should().Be(Int32.MaxValue);
        }

        [TestMethod]
        public void GetCourseMaxAllowedCollaboratorsAmount_ShouldReturnMaxCollaboratorsCountForStarterPlanValue_WhenCourseOwnerHasPlusPlan()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(CreatedBy).ReturnsForAnyArgs(user);

            user.HasPlusAccess().Returns(false);
            user.HasStarterAccess().Returns(true);

            //Act
            var result = _checker.GetCourseMaxAllowedCollaboratorsAmount(course);

            //Assert
            result.Should().Be(Constants.Collaboration.MaxCollaboratorsCountForStarterPlan);
        }

        [TestMethod]
        public void GetCourseMaxAllowedCollaboratorsAmount_ShouldReturn0_WhenCourseOwnerHasFreePlan()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(CreatedBy).ReturnsForAnyArgs(user);

            user.HasPlusAccess().Returns(false);
            user.HasStarterAccess().Returns(false);

            //Act
            var result = _checker.GetCourseMaxAllowedCollaboratorsAmount(course);

            //Assert
            result.Should().Be(0);
        }


        #endregion

        #region IsCourseCollaborationEnabled

        [TestMethod]
        public void IsCourseCollaborationEnabled_ShouldReturnTrue_WhenCourseOwnerHasPlusPlan()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(CreatedBy).ReturnsForAnyArgs(user);

            user.HasPlusAccess().Returns(true);

            //Act
            var result = _checker.IsCourseCollaborationEnabled(course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsCourseCollaborationEnabled_ShouldReturnTrue_WhenCourseOwnerHasStarterPlan_AndCourseCollaboratorsCountIsLessThanMax()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(CreatedBy).ReturnsForAnyArgs(user);

            user.HasPlusAccess().Returns(false);
            user.HasStarterAccess().Returns(true);

            //Act
            var result = _checker.IsCourseCollaborationEnabled(course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsCourseCollaborationEnabled_ShouldReturnFalse_WhenCourseOwnerHasStarterPlan_AndCourseCollaboratorsCountIsMoreThanMax()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(CreatedBy).ReturnsForAnyArgs(user);
            var collabortors = new List<CourseCollaborator>();
            for (int i = 0; i < Constants.Collaboration.MaxCollaboratorsCountForStarterPlan + 1; i++)
            {
                collabortors.Add(Substitute.For<CourseCollaborator>());
            }

            course.Collaborators.Returns(collabortors);

            user.HasPlusAccess().Returns(false);
            user.HasStarterAccess().Returns(true);

            //Act
            var result = _checker.IsCourseCollaborationEnabled(course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsCourseCollaborationEnabled_ShouldReturnFalse_WhenCourseOwnerHasFreePlan()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(CreatedBy).ReturnsForAnyArgs(user);

            user.HasPlusAccess().Returns(false);
            user.HasStarterAccess().Returns(false);

            //Act
            var result = _checker.IsCourseCollaborationEnabled(course);

            //Assert
            result.Should().BeTrue();
        }


        #endregion
    }
}
