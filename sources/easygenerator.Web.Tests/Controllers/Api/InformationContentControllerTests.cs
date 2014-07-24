using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class InformationContentControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private InformationContentController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;
        private IDomainEventPublisher _eventPublisher;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();

            _controller = new InformationContentController(_entityFactory, _eventPublisher);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create question

        [TestMethod]
        public void Create_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var result = _controller.Create(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        [TestMethod]
        public void Create_ShouldAddQuestionToObjective()
        {
            const string title = "title";
            var user = "Test user";
            DateTimeWrapper.Now = () => DateTime.MinValue;
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<InformationContent>("Information content title", CreatedBy);

            _entityFactory.InformationContent(title, user).Returns(question);

            _controller.Create(objective, title);

            objective.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var question = Substitute.For<InformationContent>("Information content title", CreatedBy);

            _entityFactory.InformationContent(title, user).Returns(question);

            var result = _controller.Create(Substitute.For<Objective>("Objective title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [TestMethod]
        public void Create_ShouldPublishDomainEvent()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var question = Substitute.For<InformationContent>("Information content title", CreatedBy);

            _entityFactory.InformationContent(title, user).Returns(question);

            _controller.Create(Substitute.For<Objective>("Objective title", CreatedBy), title);

            _eventPublisher.Received().Publish(Arg.Is<QuestionCreatedEvent>(e => e.Question == question));
        }

        #endregion
    }
}
