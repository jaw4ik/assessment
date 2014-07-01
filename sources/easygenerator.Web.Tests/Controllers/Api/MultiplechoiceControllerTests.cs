using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Import.PublishedCourse.EntityReaders;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.ViewModels.Api;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class MultiplechoiceControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private MultiplechoiceController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;
        private IDomainEventPublisher _eventPublisher;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _controller = new MultiplechoiceController(_entityFactory, _eventPublisher);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create question

        [TestMethod]
        public void CreateMultipleChoice_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var result = _controller.Create(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        [TestMethod]
        public void CreateMultipleChoice_ShouldAddTwoAnswerOptionsToQuestion()
        {
            const string title = "title";
            const string user = "Test user";
            DateTimeWrapper.Now = () => DateTime.MinValue;
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<Multiplechoice>("Question title", CreatedBy);
            var correctAnswer = Substitute.For<Answer>("Put your answer option here", true, Guid.Empty, user, DateTimeWrapper.Now());
            var incorrectAnswer = Substitute.For<Answer>("Put your answer option here", false, Guid.Empty, user, DateTimeWrapper.Now().AddSeconds(1));

            _entityFactory.MultiplechoiceQuestion(title, user).Returns(question);
            _entityFactory.Answer("Put your answer option here", true, Guid.Empty, user, DateTimeWrapper.Now()).Returns(correctAnswer);
            _entityFactory.Answer("Put your answer option here", false, Guid.Empty, user, DateTimeWrapper.Now().AddSeconds(1)).Returns(incorrectAnswer);

            _controller.Create(objective, title);

            question.Received().AddAnswer(correctAnswer, user);
            question.Received().AddAnswer(incorrectAnswer, user);
        }

        [TestMethod]
        public void CreateMultipleChoice_ShouldAddQuestionToObjective()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<Multiplechoice>("Question title", CreatedBy);

            _entityFactory.MultiplechoiceQuestion(title, user).Returns(question);

            _controller.Create(objective, title);

            objective.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void CreateMultipleChoice_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var question = Substitute.For<Multiplechoice>("Question title", CreatedBy);

            _entityFactory.MultiplechoiceQuestion(title, user).Returns(question);

            var result = _controller.Create(Substitute.For<Objective>("Objective title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

    }
}
