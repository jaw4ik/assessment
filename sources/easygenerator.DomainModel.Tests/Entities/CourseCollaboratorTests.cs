using easygenerator.DomainModel.Tests.ObjectMothers;
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
            collaborator.IsAccepted.Should().Be(false);
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

        #region AcceptCollaboration

        [TestMethod]
        public void AcceptCollaboration_ShouldSetIsAcceptedToTrue()
        {
            //Arrange
            var collaborator = CourseCollaboratorObjectMother.Create();

            //Act
            collaborator.AcceptCollaboration();

            //Assert
            collaborator.IsAccepted.Should().BeTrue();
        }

        #endregion
    }
}
