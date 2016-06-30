using easygenerator.DomainModel.Events.CourseEvents.Collaboration;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class CourseCollaboratorTests
    {
        #region Ctor

        [TestMethod]
        public void CourseCollaborator_ShouldCreateInstance()
        {
            const string userEmail = "mail@mail.com";
            const string createdBy = "user";
            var course = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var collaborator = CourseCollaboratorObjectMother.Create(course, userEmail, createdBy);

            collaborator.Id.Should().NotBeEmpty();
            collaborator.CreatedBy.Should().Be(createdBy);
            collaborator.CreatedOn.Should().Be(DateTime.MaxValue);
            collaborator.ModifiedOn.Should().Be(DateTime.MaxValue);
            collaborator.IsAccepted.Should().BeFalse();
            collaborator.IsAdmin.Should().BeFalse();
            collaborator.ModifiedBy.Should().Be(createdBy);
        }

        [TestMethod]
        public void CourseCollaborator_ShouldThrowArgumentNullException_WhenCourseIsNull()
        {
            Action action = () => CourseCollaboratorObjectMother.CreateWithCourse(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("course");
        }

        [TestMethod]
        public void CourseCollaborator_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            Action action = () => CourseCollaboratorObjectMother.CreateWithCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void CourseCollaborator_ShouldThrowArgumentNullException_WhenUserEmailHasInvalidFormat()
        {
            Action action = () => CourseCollaboratorObjectMother.CreateWithUserEmail(null);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("userEmail");
        }

        #endregion

        #region GrantAdminAccess

        [TestMethod]
        public void GrantAdminAccess_ShouldSetIsAdminTrue()
        {
            //Arrange
            var collaborator = CourseCollaboratorObjectMother.CreateWithAccess(false);
            //Act
            collaborator.GrantAdminAccess();
            //Assert
            collaborator.IsAdmin.Should().BeTrue();
        }

        [TestMethod]
        public void GrantAdminAccess_ShouldPublishDomainEvent()
        {
            //Arrange
            var collaborator = CourseCollaboratorObjectMother.CreateWithAccess(false);
            //Act
            collaborator.GrantAdminAccess();
            //Assert
            collaborator.ShouldContainSingleEventOfType<CourseCollaboratorAdminAccessGrantedEvent>();
        }

        [TestMethod]
        public void GrantAdminAccess_ShouldNotPublishDomainEvent_WhenUserIsAlreadyAdmin()
        {
            //Arrange
            var collaborator = CourseCollaboratorObjectMother.CreateWithAccess(true);
            //Act
            collaborator.GrantAdminAccess();
            //Assert
            collaborator.ShouldNotContainSingleEvent<CourseCollaboratorAdminAccessGrantedEvent>();
        }

        #endregion

    }
}
