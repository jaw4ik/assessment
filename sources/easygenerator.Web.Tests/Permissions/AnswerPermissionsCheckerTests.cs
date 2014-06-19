using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Permissions;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Permissions
{
    [TestClass]
    public class AnswerPermissionsCheckerTests
    {
        private AnswerPermissionsChecker _answerPermissionChecker;
        private IEntityPermissionsChecker<Question> _questionPermissionChecker;
        private const string Username = "user@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _questionPermissionChecker = Substitute.For<IEntityPermissionsChecker<Question>>();
            _answerPermissionChecker = new AnswerPermissionsChecker(_questionPermissionChecker);
        }

        #region HasPermissions

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenAnswerIsCreatedByUser()
        {
            //Arrange
            var answer = AnswerObjectMother.CreateWithCreatedBy(Username);

            //Act
            var result = _answerPermissionChecker.HasPermissions(Username, answer);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserHasPermissionsToQuestion()
        {
            //Arrange
            var question = Substitute.For<Multipleselect>();
            var answer = Substitute.For<Answer>();
            answer.Question.Returns(question);
            _questionPermissionChecker.HasPermissions(Username, question).Returns(true);

            //Act
            var result = _answerPermissionChecker.HasPermissions(Username, answer);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnFalse_InAnyOtherCases()
        {
            //Arrange
            var question = Substitute.For<Multipleselect>();
            var answer = Substitute.For<Answer>();
            answer.Question.Returns(question);
            _questionPermissionChecker.HasPermissions(Username, question).Returns(false);

            //Act
            var result = _answerPermissionChecker.HasPermissions(Username, answer);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
