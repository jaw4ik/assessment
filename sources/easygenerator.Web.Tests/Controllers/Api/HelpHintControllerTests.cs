using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class HelpHintControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        HelpHintController _controller;
        IEntityFactory _entityFactory;
        IHelpHintRepository _repository;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _repository = Substitute.For<IHelpHintRepository>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new HelpHintController(_repository, _entityFactory);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            //Arrange

            //Act
            var result = _controller.GetCollection();

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region HideHint

        [TestMethod]
        public void HideHint_ShouldReturnJsonSuccess_WhenHintIsNull()
        {
            //Arrange


            //Act
            var result = _controller.HideHint(null);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void HideHint_ShouldHideHint()
        {
            //Arrange
            var helpHint = HelpHintObjectMother.Create();

            //Act
            _controller.HideHint(helpHint);

            //Assert
            _repository.Received().HideHint(helpHint);
        }

        #endregion

        #region ShowHint

        [TestMethod]
        public void ShowHint_ShouldCreateHint()
        {
            //Arrange
            var hintKey = "Some hint key";
            var user = "Some user";
            _user.Identity.Name.Returns(user);
            _entityFactory.HelpHint(hintKey, user).Returns(HelpHintObjectMother.Create());

            //Act
            _controller.ShowHint(hintKey);

            //Assert
            _entityFactory.Received().HelpHint(hintKey, user);
        }

        [TestMethod]
        public void ShowHint_ShouldSaveCreatedHint()
        {
            //Arrange
            var hint = HelpHintObjectMother.Create();
            _user.Identity.Name.Returns(hint.CreatedBy);
            _entityFactory.HelpHint(hint.Name, hint.CreatedBy).Returns(hint);

            //Act
            _controller.ShowHint(hint.Name);

            //Assert
            _repository.Received().ShowHint(hint);
        }

        [TestMethod]
        public void ShowHint_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var hint = HelpHintObjectMother.Create();
            _user.Identity.Name.Returns(hint.CreatedBy);
            _entityFactory.HelpHint(hint.Name, hint.CreatedBy).Returns(hint);

            //Act
            var result = _controller.ShowHint(hint.Name);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
