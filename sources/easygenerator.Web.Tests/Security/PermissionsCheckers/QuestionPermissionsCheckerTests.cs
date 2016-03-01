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
    public class QuestionPermissionsCheckerTests
    {
        private QuestionPermissionsChecker _questionPermissionChecker;
        private IEntityPermissionsChecker<Section> _sectionPermissionChecker;
        private const string Username = "user@user.com";
        private const string CreatedBy = "creator@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _sectionPermissionChecker = Substitute.For<IEntityPermissionsChecker<Section>>();
            _questionPermissionChecker = new QuestionPermissionsChecker(_sectionPermissionChecker);
        }

        #region HasOwnerPermissions

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnTrue_WhenUserIsOwner()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _questionPermissionChecker.HasOwnerPermissions(CreatedBy, question);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnFalse_WhenUserIsNotOwner()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.CreateWithCreatedBy(CreatedBy);

            //Act
            var result = _questionPermissionChecker.HasOwnerPermissions(Username, question);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasCollaboratorPermissions

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserHasPermissionsToSection()
        {
            //Arrange
            var section = Substitute.For<Section>();
            var question = Substitute.For<Multipleselect>();
            question.Section.Returns(section);
            _sectionPermissionChecker.HasCollaboratorPermissions(Username, section).Returns(true);

            //Act
            var result = _sectionPermissionChecker.HasCollaboratorPermissions(Username, section);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_InAnyOtherCases()
        {
            //Arrange
            var section = Substitute.For<Section>();
            var question = Substitute.For<Question>();
            question.Section.Returns(section);
            _sectionPermissionChecker.HasCollaboratorPermissions(Username, section).Returns(false);

            //Act
            var result = _sectionPermissionChecker.HasCollaboratorPermissions(Username, section);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
