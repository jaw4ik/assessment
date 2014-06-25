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
    public class QuestionPermissionsCheckerTests
    {
        private QuestionPermissionsChecker _questionPermissionChecker;
        private IEntityPermissionsChecker<Objective> _objectivePermissionChecker;
        private const string Username = "user@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _objectivePermissionChecker = Substitute.For<IEntityPermissionsChecker<Objective>>();
            _questionPermissionChecker = new QuestionPermissionsChecker(_objectivePermissionChecker);
        }

        #region HasPermissions

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenQuestionIsCreatedByUser()
        {
            //Arrange
            var question = MultipleselectObjectMother.CreateWithCreatedBy(Username);

            //Act
            var result = _questionPermissionChecker.HasCollaboratorPermissions(Username, question);

            //Assert

            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserHasPermissionsToObjective()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var question = Substitute.For<Multipleselect>();
            question.Objective.Returns(objective);
            _objectivePermissionChecker.HasCollaboratorPermissions(Username, objective).Returns(true);

            //Act
            var result = _objectivePermissionChecker.HasCollaboratorPermissions(Username, objective);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnFalse_InAnyOtherCases()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var question = Substitute.For<Question>();
            question.Objective.Returns(objective);
            _objectivePermissionChecker.HasCollaboratorPermissions(Username, objective).Returns(false);

            //Act
            var result = _objectivePermissionChecker.HasCollaboratorPermissions(Username, objective);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
