using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Security.PermissionsCheckers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Security.PermissionsCheckers
{
    [TestClass]
    public class HotSpotPolygonPermissionsCheckerTests
    {
        private HotSpotPolygonPermissionsChecker _hotSpotPolygonPermissionChecker;
        private IEntityPermissionsChecker<Question> _questionPermissionChecker;
        private const string Username = "user@user.com";
        private const string CreatedBy = "creator@user.com";

        [TestInitialize]
        public void Initialize()
        {
            _questionPermissionChecker = Substitute.For<IEntityPermissionsChecker<Question>>();
            _hotSpotPolygonPermissionChecker = new HotSpotPolygonPermissionsChecker(_questionPermissionChecker);
        }

        #region HasOwnerPermissions

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnTrue_WhenUserIsOwner()
        {
            //Arrange
            var dropspot = HotSpotPolygonObjectMother.Create(createdBy: CreatedBy);

            //Act
            var result = _hotSpotPolygonPermissionChecker.HasOwnerPermissions(CreatedBy, dropspot);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasOwnerPermissions_ShouldReturnFalse_WhenUserIsNotOwner()
        {
            //Arrange
            var dropspot = HotSpotPolygonObjectMother.Create(createdBy: CreatedBy);

            //Act
            var result = _hotSpotPolygonPermissionChecker.HasOwnerPermissions(Username, dropspot);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasCollaboratorPermissions

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnTrue_WhenUserHasPermissionsToQuestion()
        {
            //Arrange
            var question = Substitute.For<HotSpot>();
            var polygon = Substitute.For<HotSpotPolygon>();
            polygon.Question.Returns(question);
            _questionPermissionChecker.HasCollaboratorPermissions(Username, question).Returns(true);

            //Act
            var result = _hotSpotPolygonPermissionChecker.HasCollaboratorPermissions(Username, polygon);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasCollaboratorPermissions_ShouldReturnFalse_InAnyOtherCases()
        {
            //Arrange
            var question = Substitute.For<HotSpot>();
            var polygon = Substitute.For<HotSpotPolygon>();
            polygon.Question.Returns(question);
            _questionPermissionChecker.HasCollaboratorPermissions(Username, question).Returns(false);

            //Act
            var result = _hotSpotPolygonPermissionChecker.HasCollaboratorPermissions(Username, polygon);

            //Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
