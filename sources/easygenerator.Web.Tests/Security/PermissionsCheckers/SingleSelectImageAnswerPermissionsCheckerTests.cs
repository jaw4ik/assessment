using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Security.PermissionsCheckers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Security.PermissionsCheckers
{
    [TestClass]
    public class SingleSelectImageAnswerPermissionsCheckerTests
    {
        private SingleSelectImageAnswerPermissionChecker _permissionChecker;
        private IEntityPermissionsChecker<Question> _questionPermissionChecker;
        private const string Username = "user@user.com";
        private const string CreatedBy = "creator@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _questionPermissionChecker = Substitute.For<IEntityPermissionsChecker<Question>>();
            _permissionChecker = new SingleSelectImageAnswerPermissionChecker(_questionPermissionChecker);
        }

        #region HasOwnerPermissions

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnTrue_WhenUserIsOwner()
        {
            //Arrange
            var answer = SingleSelectImageAnswerObjectMother.Create(createdBy: CreatedBy);

            //Act
            var result = _permissionChecker.HasOwnerPermissions(CreatedBy, answer);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnFalse_WhenUserIsNotOwner()
        {
            //Arrange
            var answer = SingleSelectImageAnswerObjectMother.Create(createdBy: CreatedBy);

            //Act
            var result = _permissionChecker.HasOwnerPermissions(Username, answer);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasCollaboratorPermissions

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserHasPermissionsToQuestion()
        {
            //Arrange
            var question = Substitute.For<SingleSelectImage>();
            var answer = Substitute.For<SingleSelectImageAnswer>();
            answer.Question.Returns(question);
            _questionPermissionChecker.HasCollaboratorPermissions(Username, question).Returns(true);

            //Act
            var result = _permissionChecker.HasCollaboratorPermissions(Username, answer);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_InAnyOtherCases()
        {
            //Arrange
            var question = Substitute.For<SingleSelectImage>();
            var answer = Substitute.For<SingleSelectImageAnswer>();
            answer.Question.Returns(question);
            _questionPermissionChecker.HasCollaboratorPermissions(Username, question).Returns(false);

            //Act
            var result = _permissionChecker.HasCollaboratorPermissions(Username, answer);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
