using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Domain.DomainOperations;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;

namespace easygenerator.Web.Tests.Domain.DomainOperations
{
    [TestClass]
    public class CourseOwnershipProviderTests
    {
        private CourseOwnershipProvider _provider;

        [TestInitialize]
        public void Initialize()
        {
            _provider = new CourseOwnershipProvider();
        }

        #region GetCourseOwnership

        [TestMethod]
        public void GetCourseOwnership_ShouldReturnOwnedOwnership_WhenUserIsNotCourseCollaborator()
        {
            //Arrange
            var course = Substitute.For<Course>();
            course.Collaborators.Returns(new List<CourseCollaborator>());

            //Act
            var ownership = _provider.GetCourseOwnership(course, course.CreatedBy);

            //Assert
            ownership.Should().Be(CourseOwnership.Owned);
        }

        [TestMethod]
        public void GetCourseOwnership_ShouldReturnOrganizationOwnership_WhenUserIsAdminCourseCollaborator()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var username = "user@name.com";
            var collaborator = CourseCollaboratorObjectMother.Create(course, username, true);
            course.Collaborators.Returns(new List<CourseCollaborator> { collaborator });

            //Act
            var ownership = _provider.GetCourseOwnership(course, username);

            //Assert
            ownership.Should().Be(CourseOwnership.Organization);
        }

        [TestMethod]
        public void GetCourseOwnership_ShouldReturnOrganizationOwnership_WhenUserNotAdminCourseCollaborator()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var username = "user@name.com";
            var collaborator = CourseCollaboratorObjectMother.Create(course, username);
            course.Collaborators.Returns(new List<CourseCollaborator> { collaborator });

            //Act
            var ownership = _provider.GetCourseOwnership(course, username);

            //Assert
            ownership.Should().Be(CourseOwnership.Shared);
        }

        #endregion
    }
}
