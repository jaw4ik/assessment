using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Security.PermissionsCheckers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Security.PermissionsCheckers
{
    [TestClass]
    public class AnswerPermissionsCheckerTests
    {
        private AnswerPermissionsChecker _answerPermissionChecker;
        private IEntityPermissionsChecker<Question> _questionPermissionChecker;
        private const string Username = "user@user.com";
        private const string CreatedBy = "creator@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _questionPermissionChecker = Substitute.For<IEntityPermissionsChecker<Question>>();
            _answerPermissionChecker = new AnswerPermissionsChecker(_questionPermissionChecker);
        }

        #region HasOwnerPermissions

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnTrue_WhenUserIsOwner()
        {
            //Arrange
            var answer = AnswerObjectMother.Create(createdBy: CreatedBy);

            //Act
            var result = _answerPermissionChecker.HasOwnerPermissions(CreatedBy, answer);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnFalse_WhenUserIsNotOwner()
        {
            //Arrange
            var answer = AnswerObjectMother.Create(createdBy: CreatedBy);

            //Act
            var result = _answerPermissionChecker.HasOwnerPermissions(Username, answer);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasCollaboratorPermissions

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserHasPermissionsToQuestion()
        {
            //Arrange
            var question = Substitute.For<Multipleselect>();
            var answer = Substitute.For<Answer>();
            answer.Question.Returns(question);
            _questionPermissionChecker.HasCollaboratorPermissions(Username, question).Returns(true);

            //Act
            var result = _answerPermissionChecker.HasCollaboratorPermissions(Username, answer);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_InAnyOtherCases()
        {
            //Arrange
            var question = Substitute.For<Multipleselect>();
            var answer = Substitute.For<Answer>();
            answer.Question.Returns(question);
            _questionPermissionChecker.HasCollaboratorPermissions(Username, question).Returns(false);

            //Act
            var result = _answerPermissionChecker.HasCollaboratorPermissions(Username, answer);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
