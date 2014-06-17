using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
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
    public class QuestionControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";
        private const QuestionType Type = QuestionType.MultipleSelect;

        private QuestionController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;
        private IDomainEventPublisher _eventPublisher;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _controller = new QuestionController(_entityFactory, _eventPublisher);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region CreateMultipleSelect question

        [TestMethod]
        public void CreateMultipleSelect_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            var result = _controller.CreateMultipleSelect(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        [TestMethod]
        public void CreateMultipleSelect_ShouldAddTwoAnswerOptionsToQuestion()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", QuestionType.MultipleSelect, CreatedBy);
            var correctAnswer = Substitute.For<Answer>("Your answer option here", true, Guid.Empty, user);
            var incorrectAnswer = Substitute.For<Answer>("Your answer option here", false, Guid.Empty, user);

            _entityFactory.Question(title, QuestionType.MultipleSelect, user).Returns(question);
            _entityFactory.Answer("Your answer option here", true, Guid.Empty, user).Returns(correctAnswer);
            _entityFactory.Answer("Your answer option here", false, Guid.Empty, user).Returns(incorrectAnswer);

            _controller.CreateMultipleSelect(objective, title);

            question.Received().AddAnswer(correctAnswer, user);
            question.Received().AddAnswer(incorrectAnswer, user);
        }

        [TestMethod]
        public void CreateMultipleSelect_ShouldAddQuestionToObjective()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", QuestionType.MultipleSelect, CreatedBy);

            _entityFactory.Question(title, QuestionType.MultipleSelect, user).Returns(question);

            _controller.CreateMultipleSelect(objective, title);

            objective.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void CreateMultipleSelect_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>("Question title", QuestionType.MultipleSelect, CreatedBy);

            _entityFactory.Question(title, QuestionType.MultipleSelect, user).Returns(question);

            var result = _controller.CreateMultipleSelect(Substitute.For<Objective>("Objective title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [TestMethod]
        public void CreateMultipleSelect_ShouldPublishDomainEvent()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>("Question title", QuestionType.MultipleSelect, CreatedBy);

            _entityFactory.Question(title, QuestionType.MultipleSelect, user).Returns(question);

            _controller.CreateMultipleSelect(Substitute.For<Objective>("Objective title", CreatedBy), title);

            _eventPublisher.Received().Publish(Arg.Any<QuestionCreatedEvent>());
        }
        #endregion

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
            var question = Substitute.For<Question>("Question title", QuestionType.FillInTheBlanks, CreatedBy);

            _entityFactory.Question(title, QuestionType.FillInTheBlanks, user).Returns(question);

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
            var question = Substitute.For<Question>("Question title", QuestionType.FillInTheBlanks, CreatedBy);

            _entityFactory.Question(title, QuestionType.FillInTheBlanks, user).Returns(question);

            _controller.CreateFillInTheBlank(objective, title);

            _eventPublisher.Received().Publish(Arg.Any<QuestionCreatedEvent>());
        }

        [TestMethod]
        public void CreateFillInTheBlank_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>("Question title", QuestionType.FillInTheBlanks, CreatedBy);

            _entityFactory.Question(title, QuestionType.FillInTheBlanks, user).Returns(question);

            var result = _controller.CreateFillInTheBlank(Substitute.For<Objective>("Objective title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region CreateMultipleChoice question

        [TestMethod]
        public void CreateMultipleChoice_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            var result = _controller.CreateMultipleChoice(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        [TestMethod]
        public void CreateMultipleChoice_ShouldAddTwoAnswerOptionsToQuestion()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", QuestionType.MultipleChoice, CreatedBy);
            var correctAnswer = Substitute.For<Answer>("Your answer option here", true, Guid.Empty, user);
            var incorrectAnswer = Substitute.For<Answer>("Your answer option here", false, Guid.Empty, user);

            _entityFactory.Question(title, QuestionType.MultipleChoice, user).Returns(question);
            _entityFactory.Answer("Your answer option here", true, Guid.Empty, user).Returns(correctAnswer);
            _entityFactory.Answer("Your answer option here", false, Guid.Empty, user).Returns(incorrectAnswer);

            _controller.CreateMultipleChoice(objective, title);

            question.Received().AddAnswer(correctAnswer, user);
            question.Received().AddAnswer(incorrectAnswer, user);
        }

        [TestMethod]
        public void CreateMultipleChoice_ShouldAddQuestionToObjective()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", QuestionType.MultipleChoice, CreatedBy);

            _entityFactory.Question(title, QuestionType.MultipleChoice, user).Returns(question);

            _controller.CreateMultipleChoice(objective, title);

            objective.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void CreateMultipleChoice_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>("Question title", QuestionType.MultipleChoice, CreatedBy);

            _entityFactory.Question(title, QuestionType.MultipleChoice, user).Returns(question);

            var result = _controller.CreateMultipleChoice(Substitute.For<Objective>("Objective title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region Delete questions

        [TestMethod]
        public void Delete_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            var result = _controller.Delete(null, new List<Question>() { });

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        [TestMethod]
        public void Delete_ShouldReturnBadRequest_WnenQuestionsIsNull()
        {
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);

            var result = _controller.Delete(objective, null);

            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        [TestMethod]
        public void Delete_ShouldRemoveQuestionsFromObjective()
        {
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question1 = Substitute.For<Question>("Question title 1", Type, CreatedBy);
            var question2 = Substitute.For<Question>("Question title 2", Type, CreatedBy);

            _controller.Delete(objective, new List<Question>() { question1, question2 });

            objective.Received().RemoveQuestion(question1, user);
            objective.Received().RemoveQuestion(question2, user);
        }

        [TestMethod]
        public void Delete_ShouldPublishDomainEvent()
        {
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question1 = Substitute.For<Question>("Question title 1", Type, CreatedBy);
            var question2 = Substitute.For<Question>("Question title 2", Type, CreatedBy);

            _controller.Delete(objective, new List<Question>() { question1, question2 });

            _eventPublisher.Received().Publish(Arg.Any<QuestionsDeletedEvent>());
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question1 = Substitute.For<Question>("Question title 1", Type, CreatedBy);
            var question2 = Substitute.For<Question>("Question title 2", Type, CreatedBy);

            var result = _controller.Delete(objective, new List<Question>() { question1, question2 });

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = objective.ModifiedOn });
        }

        #endregion

        #region Update title

        [TestMethod]
        public void Update_ShouldReturnJsonErrorResult_WhenQuestionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }


        [TestMethod]
        public void Update_ShouldUpdateQuestionTitle()
        {
            const string title = "updated title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>("Question title", Type, CreatedBy);

            _controller.UpdateTitle(question, title);

            question.Received().UpdateTitle(title, user);
        }


        [TestMethod]
        public void Update_ShouldPublishDomainEvent()
        {
            var question = Substitute.For<Question>("Question title", Type, CreatedBy);

            var result = _controller.UpdateTitle(question, String.Empty);

            _eventPublisher.Received().Publish(Arg.Any<QuestionTitleUpdatedEvent>());
        }


        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>("Question title", Type, CreatedBy);

            var result = _controller.UpdateTitle(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Update content

        [TestMethod]
        public void UpdateContent_ShouldReturnJsonErrorResult_WhenQuestionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }


        [TestMethod]
        public void UpdateContent_ShouldUpdateQuestionContent()
        {
            const string content = "updated content";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>("Question title", Type, CreatedBy);

            _controller.UpdateContent(question, content);

            question.Received().UpdateContent(content, user);
        }

        [TestMethod]
        public void UpdateContent_ShouldPublishDomainEvent()
        {
            var question = Substitute.For<Question>("Question title", Type, CreatedBy);

            var result = _controller.UpdateContent(question, String.Empty);

            _eventPublisher.Received().Publish(Arg.Any<QuestionContentUpdatedEvent>());
        }

        [TestMethod]
        public void UpdateContent_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>("Question title", Type, CreatedBy);

            var result = _controller.UpdateContent(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
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
            var question = QuestionObjectMother.Create();
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
            var question = Substitute.For<Question>("Question title", Type, CreatedBy);

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
            var question = Substitute.For<Question>("Question title", Type, CreatedBy);

            _controller.UpdateFillInTheBlank(question, fillInTheBlank, answersViewmodels);

            question.Received().UpdateContent(fillInTheBlank, CreatedBy);
        }

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>("Question title", Type, CreatedBy);
            var answers = new List<Answer>();
            var answersViewModel = new List<AnswerViewModel>();

            var result = _controller.UpdateFillInTheBlank(question, String.Empty, answersViewModel);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

    }
}
