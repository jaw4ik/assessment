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
    public class DragAndDropTextQuestionControllerTests
    {
        private DragAndDropTextQuestionController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _controller = new DragAndDropTextQuestionController(_entityFactory);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }


        #region Change Drag&Drop background

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
            var result = _controller.ChangeBackground(Substitute.For<DragAndDropText>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeBackground_ShouldChangeBackground()
        {
            //Arrange
            const string background = "background";
            var question = Substitute.For<DragAndDropText>();

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
            var result = _controller.ChangeBackground(Substitute.For<DragAndDropText>(), "background");

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Create Dropspot

        [TestMethod]
        public void CreateDropspot_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.CreateDropspot(null, "text");

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void CreateDropspot_ShouldReturnBadRequest_WhenTextIsNull()
        {
            //Arrange


            //Act
            var result = _controller.CreateDropspot(Substitute.For<DragAndDropText>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }


        [TestMethod]
        public void CreateDropspot_ShouldAddDropspot()
        {
            //Arrange
            const string text = "text";
            var question = Substitute.For<DragAndDropText>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            var dropspot = Substitute.For<Dropspot>(text, 0, 0, username);
            _entityFactory.Dropspot(text, 0, 0, username).Returns(dropspot);

            //Act
            _controller.CreateDropspot(question, text);

            //Assert
            question.Received().AddDropspot(dropspot, username);
        }

        [TestMethod]
        public void CreateDropspot_ShouldReturnJsonSuccessWithDropspotId()
        {
            //Arrange
            var dropspot = Substitute.For<Dropspot>();
            _entityFactory.Dropspot(Arg.Any<string>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(dropspot);

            //Act
            var result = _controller.CreateDropspot(Substitute.For<DragAndDropText>(), "text");

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(dropspot.Id.ToNString());
        }

        #endregion

        #region Delete Dropspot

        [TestMethod]
        public void DeleteDropspot_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.DeleteDropspot(null, Substitute.For<Dropspot>());

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void DeleteDropspot_ShouldReturnBadRequest_WhenDropspotIsNull()
        {
            //Arrange


            //Act
            var result = _controller.DeleteDropspot(Substitute.For<DragAndDropText>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }


        [TestMethod]
        public void DeleteDropspot_ShouldRemoveDropspot()
        {
            //Arrange
            var question = Substitute.For<DragAndDropText>();
            var dropspot = Substitute.For<Dropspot>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.DeleteDropspot(question, dropspot);

            //Assert
            question.Received().RemoveDropspot(dropspot, username);
        }

        [TestMethod]
        public void DeleteDropspot_ShouldReturnJsonSuccess()
        {
            //Arrange


            //Act
            var result = _controller.DeleteDropspot(Substitute.For<DragAndDropText>(), Substitute.For<Dropspot>());

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Change Dropspot text

        [TestMethod]
        public void ChangeDropspotText_ShouldReturnBadRequest_WhenDropspotIsNull()
        {
            //Arrange


            //Act
            var result = _controller.ChangeDropspotText(null, "text");

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeDropspotText_ShouldReturnBadRequest_WhenTextIsNull()
        {
            //Arrange


            //Act
            var result = _controller.ChangeDropspotText(Substitute.For<Dropspot>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeDropspotText_ShouldChangeDropspotText()
        {
            //Arrange
            var dropspot = Substitute.For<Dropspot>();
            const string text = "text";

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.ChangeDropspotText(dropspot, text);

            //Assert
            dropspot.Received().ChangeText(text, username);
        }

        #endregion

        #region Change Dropspot position

        [TestMethod]
        public void ChangeDropspotPosition_ShouldReturnBadRequest_WhenDropspotIsNull()
        {
            //Arrange


            //Act
            var result = _controller.ChangeDropspotPosition(null, 0, 0);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeDropspotPosition_ShouldReturnBadRequest_WhenXIsNull()
        {
            //Arrange


            //Act
            var result = _controller.ChangeDropspotPosition(Substitute.For<Dropspot>(), null, 0);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeDropspotPosition_ShouldReturnBadRequest_WhenYIsNull()
        {
            //Arrange


            //Act
            var result = _controller.ChangeDropspotPosition(Substitute.For<Dropspot>(), 0, null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeDrospotPosition_ShouldChangeDropspotPosition()
        {
            //Arrange
            const int x = 10;
            const int y = 20;
            var dropspot = Substitute.For<Dropspot>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.ChangeDropspotPosition(dropspot, x, y);

            //Assert
            dropspot.Received().ChangePosition(x, y, username);
        }

        #endregion

    }
}
