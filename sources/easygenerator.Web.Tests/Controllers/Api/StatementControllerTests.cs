using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api.easygenerator.Web.Controllers.Api;
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
    public class StatementControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private StatementController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _controller = new StatementController(_entityFactory);

            _user = Substitute.For<IPrincipal>();
            _user.Identity.Name.Returns(CreatedBy);

            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
            DateTimeWrapper.Now = () => DateTime.MinValue;
        }

        #region Create question

        [TestMethod]
        public void CreateStatement_ShouldReturnJsonErrorResult_WnenSectionIsNull()
        {
            var result = _controller.Create(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Section is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionNotFoundError");
        }

        [TestMethod]
        public void CreateStatement_ShouldCreateQuestion()
        {
            const string title = "title";
            const string defaultStatementText = "Type your statement here...";

            var section = Substitute.For<Section>("Section title", CreatedBy);
            var question = StatementObjectMother.Create(title, CreatedBy);

            _entityFactory.StatementQuestion(title, defaultStatementText, CreatedBy).Returns(question);

            _controller.Create(section, title);
            _entityFactory.Received().StatementQuestion(title, defaultStatementText, CreatedBy);
        }

        [TestMethod]
        public void CreateStatement_ShouldAddQuestionToSection()
        {
            const string title = "title";
            const string defaultStatementText = "Type your statement here...";
            var section = Substitute.For<Section>("Section title", CreatedBy);
            var question = StatementObjectMother.Create(title, CreatedBy);

            _entityFactory.StatementQuestion(title, defaultStatementText, CreatedBy).Returns(question);

            _controller.Create(section, title);

            section.Received().AddQuestion(question, CreatedBy);
        }

        [TestMethod]
        public void CreateStatement_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            const string defaultStatementText = "Type your statement here...";

            var question = StatementObjectMother.Create(title, CreatedBy);

            _entityFactory.StatementQuestion(title, defaultStatementText, CreatedBy).Returns(question);

            var result = _controller.Create(Substitute.For<Section>("Section title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

    }
}
