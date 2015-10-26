using System.Collections.ObjectModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
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
        private const string ModifiedBy = "easygenerator2@easygenerator.com";

        private QuestionController _controller;
        private ICloner _cloner;
        private IEntityModelMapper<Question> _entityModelMapper;

        IPrincipal _user;
        HttpContextBase _context;


        [TestInitialize]
        public void InitializeContext()
        {
            _cloner = Substitute.For<ICloner>();
            _entityModelMapper = Substitute.For<IEntityModelMapper<Question>>();
            _controller = new QuestionController(_cloner, _entityModelMapper);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

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
            var question1 = Substitute.For<Question>("Question title 1", CreatedBy);
            var question2 = Substitute.For<Question>("Question title 2", CreatedBy);

            _controller.Delete(objective, new List<Question>() { question1, question2 });

            objective.Received().RemoveQuestion(question1, user);
            objective.Received().RemoveQuestion(question2, user);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question1 = Substitute.For<Question>("Question title 1", CreatedBy);
            var question2 = Substitute.For<Question>("Question title 2", CreatedBy);

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
            var question = Substitute.For<Question>("Question title", CreatedBy);

            _controller.UpdateTitle(question, title);

            question.Received().UpdateTitle(title, user);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>("Question title", CreatedBy);

            var result = _controller.UpdateTitle(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Update voice-over

        [TestMethod]
        public void UpdateVoiceOver_ShouldReturnJsonErrorResult_WhenQuestionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateVoiceOver(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateQuestionVoiceOver()
        {
            const string voiceOver = "updated voice-over";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>();

            _controller.UpdateVoiceOver(question, voiceOver);

            question.Received().UpdateVoiceOver(voiceOver, user);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>();

            var result = _controller.UpdateVoiceOver(question, String.Empty);

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
            var question = Substitute.For<Question>("Question title", CreatedBy);

            _controller.UpdateContent(question, content);

            question.Received().UpdateContent(content, user);
        }

        [TestMethod]
        public void UpdateContent_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>("Question title", CreatedBy);

            var result = _controller.UpdateContent(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region GetQuestionFeedback

        [TestMethod]
        public void GetQuestionFeedback_ShouldReturnJsonError_WhenQuestionIsNull()
        {
            var result = _controller.GetQuestionFeedback(null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }

        [TestMethod]
        public void GetQuestionFeedback_ShouldReturnJsonSuccessResultWithFeedbackTexts()
        {
            var question = MultipleselectObjectMother.Create();
            question.UpdateCorrectFeedbackText("Correct feedback");
            question.UpdateIncorrectFeedbackText("Incorrect feedback");

            var result = _controller.GetQuestionFeedback(question);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new
            {
                ModifiedOn = question.ModifiedOn,
                CorrectFeedbackText = "Correct feedback",
                IncorrectFeedbackText = "Incorrect feedback"
            });
        }

        #endregion

        #region UpdateCorrectFeedback

        [TestMethod]
        public void UpdateCorrectFeedback_ShouldReturnJsonError_WhenQuestionIsNull()
        {
            var result = _controller.UpdateCorrectFeedback(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }

        [TestMethod]
        public void UpdateCorrectFeedback_ShouldUpdateQuestionFeedback()
        {
            var question = Substitute.For<Question>("Question title", CreatedBy);
            _controller.UpdateCorrectFeedback(question, "correct feedback");

            question.Received().UpdateCorrectFeedbackText("correct feedback");
        }

        [TestMethod]
        public void UpdateCorrectFeedback_ShouldReturnJsonSuccessResult()
        {
            var question = MultipleselectObjectMother.Create("Question title", CreatedBy);

            var result = _controller.UpdateCorrectFeedback(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region UpdateIncorrectFeedback

        [TestMethod]
        public void UpdateIncorrectFeedback_ShouldReturnJsonError_WhenQuestionIsNull()
        {
            var result = _controller.UpdateIncorrectFeedback(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }

        [TestMethod]
        public void UpdateIncorrectFeedback_ShouldUpdateQuestionFeedback()
        {
            var question = Substitute.For<Question>("Question title", CreatedBy);

            _controller.UpdateIncorrectFeedback(question, "incorrect feedback");

            question.Received().UpdateIncorrectFeedbackText("incorrect feedback");
        }

        [TestMethod]
        public void UpdateIncorrectFeedback_ShouldReturnJsonSuccessResult()
        {
            var question = MultipleselectObjectMother.Create("Question title", CreatedBy);

            var result = _controller.UpdateIncorrectFeedback(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region UpdateLearningContentsOrder

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldReturnHttpNotFoundResult_WhenQuestionIsNull()
        {
            //Arrange

            //Act
            var result = _controller.UpdateLearningContentsOrder(null, new Collection<LearningContent>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldCallUpdateLearningContentsForQuestion()
        {
            //Arrange
            var question = Substitute.For<Question>();
            var learningContents = new Collection<LearningContent>();
            _user.Identity.Name.Returns(ModifiedBy);

            //Act
            _controller.UpdateLearningContentsOrder(question, learningContents);

            //Assert
            question.Received().UpdateLearningContentsOrder(learningContents, ModifiedBy);
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var question = Substitute.For<Question>();
            var learningContents = new Collection<LearningContent>();
            _user.Identity.Name.Returns(ModifiedBy);

            //Act
            var result = _controller.UpdateLearningContentsOrder(question, learningContents);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Copy question

        [TestMethod]
        public void Copy_ShouldReturnBadRequest_WnenQuestionIsNull()
        {
            var result = _controller.Copy(null, null);

            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        [TestMethod]
        public void Copy_ShouldReturnBadRequest_WnenDestinationObjectiveIsNull()
        {
            var question = Substitute.For<Question>("Question title", CreatedBy);

            var result = _controller.Copy(question, null);

            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        [TestMethod]
        public void Copy_ShouldCloneQuestion()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var question = Substitute.For<Question>("Question title", CreatedBy);
            var destinationObjective = Substitute.For<Objective>("Objective title", CreatedBy);

            _cloner.Clone(question, user).Returns(Substitute.For<Question>());

            //Act
            _controller.Copy(question, destinationObjective);

            //Assert
            _cloner.Received().Clone(question, user);
        }

        [TestMethod]
        public void Copy_ShouldAddCopiedQuestionToDestinationObjective()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var destinationObjective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", CreatedBy);
            var questionCopy = Substitute.For<Question>("Question copy title", CreatedBy);

            _cloner.Clone(question, user).Returns(questionCopy);

            //Act
            _controller.Copy(question, destinationObjective);

            //Assert
            destinationObjective.Received().AddQuestion(questionCopy, user);
        }

        [TestMethod]
        public void Copy_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var destinationObjective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", CreatedBy);
            var questionCopy = Substitute.For<Question>("Question copy title", CreatedBy);
            var questionModel = new {Id = "Question Id", Title = "Question title", Type = "Question type"};

            _cloner.Clone(question, user).Returns(questionCopy);
            _entityModelMapper.Map(questionCopy).Returns(questionModel);

            //Act
            var result = _controller.Copy(question, destinationObjective);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(questionModel);
        }

        #endregion

        #region Move question

        [TestMethod]
        public void Move_ShouldReturnBadRequest_WnenQuestionIsNull()
        {
            //Arrange

            //Act
            var result = _controller.Move(null, null);

            //Assert
            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        [TestMethod]
        public void Move_ShouldReturnBadRequest_WnenDestinationObjectiveIsNull()
        {
            //Arrange
            var question = Substitute.For<Question>("Question title", CreatedBy);

            //Act
            var result = _controller.Move(question, null);

            //Assert
            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        [TestMethod]
        public void Move_ShouldRemoveQuestionFromSourceObjective()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var sourceObjective = Substitute.For<Objective>("Source objective title", CreatedBy);
            var destinationObjective = Substitute.For<Objective>("Destination objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", CreatedBy);
            question.Objective.Returns(sourceObjective);

            //Act
            _controller.Move(question, destinationObjective);

            //Assert
            sourceObjective.Received().RemoveQuestion(question, user);
        }

        [TestMethod]
        public void Move_ShouldNotRemoveQuestionFromSourceObjective_WhenDestinationObjectiveIsSource()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var destinationObjective = Substitute.For<Objective>("Destination objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", CreatedBy);
            question.Objective.Returns(destinationObjective);

            //Act
            _controller.Move(question, destinationObjective);

            //Assert
            destinationObjective.DidNotReceive().RemoveQuestion(question, user);
        }

        [TestMethod]
        public void Move_ShouldAddQuestionToDestinationObjective()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var sourceObjective = Substitute.For<Objective>("Source objective title", CreatedBy);
            var destinationObjective = Substitute.For<Objective>("Destination objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", CreatedBy);
            question.Objective.Returns(sourceObjective);

            //Act
            _controller.Move(question, destinationObjective);

            //Assert
            destinationObjective.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void Move_ShouldAddQuestionToDestinationObjective_WhenDestinationObjectiveIsSource()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var destinationObjective = Substitute.For<Objective>("Destination objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", CreatedBy);
            question.Objective.Returns(destinationObjective);

            //Act
            _controller.Move(question, destinationObjective);

            //Assert
            destinationObjective.DidNotReceive().AddQuestion(question, user);
        }

        [TestMethod]
        public void Move_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var destinationObjective = Substitute.For<Objective>("Destination objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", CreatedBy);
            question.Objective.Returns(destinationObjective);

            //Act
            var result = _controller.Move(question, destinationObjective);

            //Assert

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = destinationObjective.ModifiedOn });
        }

        #endregion
    }
}
