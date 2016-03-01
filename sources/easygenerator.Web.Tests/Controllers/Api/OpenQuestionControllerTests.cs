using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class OpenQuestionControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private OpenQuestionController _controller;
        
        private IEntityFactory _entityFactory;
        private IPrincipal _user;
        private HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();

            _controller = new OpenQuestionController(_entityFactory);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create question

        [TestMethod]
        public void Create_ShouldReturnJsonErrorResult_WnenSectionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var result = _controller.Create(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Section is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionNotFoundError");
        }

        [TestMethod]
        public void Create_ShouldAddQuestionToSection()
        {
            const string title = "title";
            var user = "Test user";
            DateTimeWrapper.Now = () => DateTime.MinValue;
            _user.Identity.Name.Returns(user);
            var section = Substitute.For<Section>("Section title", CreatedBy);
            var question = Substitute.For<OpenQuestion>("Information content title", CreatedBy);

            _entityFactory.OpenQuestion(title, user).Returns(question);

            _controller.Create(section, title);

            section.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var question = Substitute.For<OpenQuestion>("Information content title", CreatedBy);

            _entityFactory.OpenQuestion(title, user).Returns(question);

            var result = _controller.Create(Substitute.For<Section>("Section title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion
    }
}
