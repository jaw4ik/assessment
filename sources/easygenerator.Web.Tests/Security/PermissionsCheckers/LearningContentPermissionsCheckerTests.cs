using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Security.PermissionsCheckers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Security.PermissionsCheckers
{
    [TestClass]
    public class LearningContentPermissionsCheckerTests
    {
        private LearningContentPermissionsChecker _learningContentPermissionChecker;
        private IEntityPermissionsChecker<Question> _questionPermissionChecker;
        private const string Username = "user@user.com";
        private const string CreatedBy = "creator@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _questionPermissionChecker = Substitute.For<IEntityPermissionsChecker<Question>>();
            _learningContentPermissionChecker = new LearningContentPermissionsChecker(_questionPermissionChecker);
        }

        #region HasOwnerPermissions

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnTrue_WhenUserIsOwner()
        {
            //Arrange
            var course = LearningContentObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _learningContentPermissionChecker.HasOwnerPermissions(CreatedBy, course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnFalse_WhenUserIsNotOwner()
        {
            //Arrange
            var course = LearningContentObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _learningContentPermissionChecker.HasOwnerPermissions(Username, course);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasCollaboratorPermissions

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserHasPermissionsToQuestion()
        {
            //Arrange
            var question = Substitute.For<Question>();
            var learningContent = Substitute.For<LearningContent>();
            learningContent.Question.Returns(question);
            _questionPermissionChecker.HasCollaboratorPermissions(Username, question).Returns(true);

            //Act
            var result = _learningContentPermissionChecker.HasCollaboratorPermissions(Username, learningContent);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_InAnyOtherCases()
        {
            //Arrange
            var question = Substitute.For<Question>();
            var learningContent = Substitute.For<LearningContent>();
            learningContent.Question.Returns(question);
            _questionPermissionChecker.HasCollaboratorPermissions(Username, question).Returns(false);

            //Act
            var result = _learningContentPermissionChecker.HasCollaboratorPermissions(Username, learningContent);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

    }
}
