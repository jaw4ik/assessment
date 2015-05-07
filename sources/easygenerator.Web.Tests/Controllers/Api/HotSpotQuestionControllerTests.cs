using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class HotSpotQuestionControllerTests
    {
        private HotSpotQuestionController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _controller = new HotSpotQuestionController(_entityFactory);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }


        #region Change HotSpot background

        [TestMethod]
        public void ChangeBackground_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.ChangeBackground(null, "background");

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeBackground_ShouldReturnBadRequest_WhenBackgroundIsNull()
        {
            //Arrange


            //Act
            var result = _controller.ChangeBackground(Substitute.For<HotSpot>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeBackground_ShouldChangeBackground()
        {
            //Arrange
            const string background = "background";
            var question = Substitute.For<HotSpot>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.ChangeBackground(question, background);

            //Assert
            question.Received().ChangeBackground(background, username);
        }

        [TestMethod]
        public void ChangeBackground_ShouldReturnJsonSuccess()
        {
            //Arrange


            //Act
            var result = _controller.ChangeBackground(Substitute.For<HotSpot>(), "background");

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Create HotSpotPolygon

        [TestMethod]
        public void CreateHotSpotPolygon_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.CreateHotSpotPolygon(null, "text");

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void CreateHotSpotPolygon_ShouldReturnBadRequest_WhenPointsIsNull()
        {
            //Arrange


            //Act
            var result = _controller.CreateHotSpotPolygon(Substitute.For<HotSpot>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void CreateHotSpotPolygon_ShouldAddHotSpotPolygon()
        {
            //Arrange
            const string points = "[{x:1, y:1}]";
            var question = Substitute.For<HotSpot>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            var polygon = Substitute.For<HotSpotPolygon>(points, username);
            _entityFactory.HotSpotPolygon(points, username).Returns(polygon);

            //Act
            _controller.CreateHotSpotPolygon(question, points);

            //Assert
            question.Received().AddHotSpotPolygon(polygon, username);
        }

        [TestMethod]
        public void CreateHotSpotPolygon_ShouldReturnJsonSuccessWithDropspotId()
        {
            //Arrange
            var polygon = Substitute.For<HotSpotPolygon>();
            _entityFactory.HotSpotPolygon(Arg.Any<string>(), Arg.Any<string>()).Returns(polygon);

            //Act
            var result = _controller.CreateHotSpotPolygon(Substitute.For<HotSpot>(), "[{x:1, y:1}]");

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(polygon.Id.ToNString());
        }

        #endregion

        #region Change HotSpotPolygon

        [TestMethod]
        public void UpdateHotSpotPolygonPoints_ShouldReturnBadRequest_WhenHotSpotPolygonIsNull()
        {
            //Arrange


            //Act
            var result = _controller.UpdateHotSpotPolygonPoints(null, "[{x:1, y:1}]");

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void UpdateHotSpotPolygonPoints_ShouldReturnBadRequest_WhenPointsIsNull()
        {
            //Arrange


            //Act
            var result = _controller.UpdateHotSpotPolygonPoints(Substitute.For<HotSpotPolygon>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void UpdateHotSpotPolygonPoints_ShouldUpdateHotSpotPolygonPoints()
        {
            //Arrange
            var polygon = Substitute.For<HotSpotPolygon>();
            const string points = "[{x:1, y:1}]";

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.UpdateHotSpotPolygonPoints(polygon, points);

            //Assert
            polygon.Received().Update(points, username);
        }

        #endregion

        #region Delete HotSpotPolygon

        [TestMethod]
        public void DeleteHotSpotPolygon_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.DeleteHotSpotPolygon(null, Substitute.For<HotSpotPolygon>());

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void DeleteHotSpotPolygon_ShouldReturnBadRequest_WhenHotSpotPolygonIsNull()
        {
            //Arrange


            //Act
            var result = _controller.DeleteHotSpotPolygon(Substitute.For<HotSpot>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }


        [TestMethod]
        public void DeleteHotSpotPolygon_ShouldRemoveHotSpotPolygon()
        {
            //Arrange
            var question = Substitute.For<HotSpot>();
            var polygon = Substitute.For<HotSpotPolygon>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.DeleteHotSpotPolygon(question, polygon);

            //Assert
            question.Received().RemoveHotSpotPolygon(polygon, username);
        }

        [TestMethod]
        public void DeleteHotSpotPolygon_ShouldReturnJsonSuccess()
        {
            //Arrange


            //Act
            var result = _controller.DeleteHotSpotPolygon(Substitute.For<HotSpot>(), Substitute.For<HotSpotPolygon>());

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Change HotSpot type

        [TestMethod]
        public void ChangeType_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.ChangeType(null, false);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeType_ShouldChangeType()
        {
            //Arrange
            var question = Substitute.For<HotSpot>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.ChangeType(question, true);

            //Assert
            question.Received().ChangeType(true, username);
        }

        [TestMethod]
        public void ChangeType_ShouldReturnJsonSuccess()
        {
            //Arrange


            //Act
            var result = _controller.ChangeType(Substitute.For<HotSpot>(), true);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
