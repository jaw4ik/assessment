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
    public class FillInTheBlanksControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private FillInTheBlanksController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;
        private IDomainEventPublisher _eventPublisher;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _controller = new FillInTheBlanksController(_entityFactory, _eventPublisher);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region CreateFillInTheBlank question

        [TestMethod]
        public void CreateFillInTheBlank_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            var result = _controller.CreateFillInTheBlank(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        [TestMethod]
        public void CreateFillInTheBlank_ShouldAddQuestionToObjective()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);

            _entityFactory.FillInTheBlanksQuestion(title, user).Returns(question);

            _controller.CreateFillInTheBlank(objective, title);

            objective.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void CreateFillInTheBlank_ShouldPublishDomainEvent()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);

            _entityFactory.FillInTheBlanksQuestion(title, user).Returns(question);

            _controller.CreateFillInTheBlank(objective, title);

            _eventPublisher.Received().Publish(Arg.Any<QuestionCreatedEvent>());
        }

        [TestMethod]
        public void CreateFillInTheBlank_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);

            _entityFactory.FillInTheBlanksQuestion(title, user).Returns(question);

            var result = _controller.CreateFillInTheBlank(Substitute.For<Objective>("Objective title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region UpdateFillInTheBlank

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldReturnHttpNotFoundResult_WhenQuestionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateFillInTheBlank(null, String.Empty, null);

            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldRemoveAllAnswerOptions_WhenCollectionOfAnswerViewmodelEmpty()
        {
            //Arrange
            var question = FillInTheBlanksObjectMother.Create();
            var answersViewmodels = new List<AnswerViewModel>();
            var answer1 = AnswerObjectMother.Create();
            var answer2 = AnswerObjectMother.Create();
            question.AddAnswer(answer1, CreatedBy);
            question.AddAnswer(answer2, CreatedBy);

            //Act
            _controller.UpdateFillInTheBlank(question, String.Empty, answersViewmodels);

            //Assert
            question.Answers.ToList().Count.Should().Be(0);
        }

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldUpdateAnswers()
        {
            const string fillInTheBlank = "updated content";
            var answerModel = new AnswerViewModel() { GroupId = Guid.NewGuid(), IsCorrect = true, Text = "ololosh" };
            var answersViewmodel = new List<AnswerViewModel>() { answerModel };
            _user.Identity.Name.Returns(CreatedBy);
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);

            _controller.UpdateFillInTheBlank(question, fillInTheBlank, answersViewmodel);

            question.Received().UpdateAnswers(Arg.Any<ICollection<Answer>>(), CreatedBy);
        }

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldUpdateQuestionContent()
        {
            const string fillInTheBlank = "updated content";

            var answers = new List<Answer>();
            var answersViewmodels = new List<AnswerViewModel>();
            _user.Identity.Name.Returns(CreatedBy);
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);

            _controller.UpdateFillInTheBlank(question, fillInTheBlank, answersViewmodels);

            question.Received().UpdateContent(fillInTheBlank, CreatedBy);
        }

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);
            var answers = new List<Answer>();
            var answersViewModel = new List<AnswerViewModel>();

            var result = _controller.UpdateFillInTheBlank(question, String.Empty, answersViewModel);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

    }
}
