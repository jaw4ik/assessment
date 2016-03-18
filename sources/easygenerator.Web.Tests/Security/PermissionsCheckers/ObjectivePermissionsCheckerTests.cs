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
    public class SectionPermissionsCheckerTests
    {
        private SectionPermissionsChecker _sectionPermissionChecker;
        private IEntityPermissionsChecker<Course> _coursePermissionChecker;
        private const string CreatedBy = "creator@user.com";
        private const string Username = "user@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _coursePermissionChecker = Substitute.For<IEntityPermissionsChecker<Course>>();
            _sectionPermissionChecker = new SectionPermissionsChecker(_coursePermissionChecker);
        }

        #region HasOwnerPermissions

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnTrue_WhenUserIsOwner()
        {
            //Arrange
            var course = SectionObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _sectionPermissionChecker.HasOwnerPermissions(CreatedBy, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnFalse_WhenUserIsNotOwner()
        {
            //Arrange
            var course = SectionObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _sectionPermissionChecker.HasOwnerPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasCollaboratorPermissions

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserIsSectionOwner()
        {
            //Arrange
            var section = SectionObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _sectionPermissionChecker.HasCollaboratorPermissions(CreatedBy, section);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserIsSectionCourseCollaborator()
        {
            //Arrange
            var section = Substitute.For<Section>();
            var course = Substitute.For<Course>();
            section.Courses.Returns(new List<Course> { course });
            _coursePermissionChecker.HasCollaboratorPermissions(Username, course).Returns(true);

            //Act
            var result = _sectionPermissionChecker.HasCollaboratorPermissions(Username, section);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_WhenUserIsNotSectionOwnerOrCourseCollaborator()
        {
            //Arrange
            var section = Substitute.For<Section>();
            var course = CourseObjectMother.Create();
            _coursePermissionChecker.HasCollaboratorPermissions(Username, course).Returns(false);
            section.Courses.Returns(new List<Course> { course });

            //Act
            var result = _sectionPermissionChecker.HasCollaboratorPermissions(Username, section);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
