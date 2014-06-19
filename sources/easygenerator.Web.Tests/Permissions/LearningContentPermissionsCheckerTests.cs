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
    public class LearningContentPermissionsCheckerTests
    {
        private LearningContentPermissionsChecker _learningContentPermissionChecker;
        private IEntityPermissionsChecker<Question> _questionPermissionChecker;
        private const string Username = "user@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _questionPermissionChecker = Substitute.For<IEntityPermissionsChecker<Question>>();
            _learningContentPermissionChecker = new LearningContentPermissionsChecker(_questionPermissionChecker);
        }

        #region HasPermissions

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenLearningContentIsCreatedByUser()
        {
            //Arrange
            var learningContent = LearningContentObjectMother.CreateWithCreatedBy(Username);

            //Act
            var result = _learningContentPermissionChecker.HasPermissions(Username, learningContent);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnTrue_WhenUserHasPermissionsToQuestion()
        {
            //Arrange
            var question = Substitute.For<Question>();
            var learningContent = Substitute.For<LearningContent>();
            learningContent.Question.Returns(question);
            _questionPermissionChecker.HasPermissions(Username, question).Returns(true);

            //Act
            var result = _learningContentPermissionChecker.HasPermissions(Username, learningContent);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPermissions_ShouldReturnFalse_InAnyOtherCases()
        {
            //Arrange
            var question = Substitute.For<Question>();
            var learningContent = Substitute.For<LearningContent>();
            learningContent.Question.Returns(question);
            _questionPermissionChecker.HasPermissions(Username, question).Returns(false);

            //Act
            var result = _learningContentPermissionChecker.HasPermissions(Username, learningContent);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

    }
}
