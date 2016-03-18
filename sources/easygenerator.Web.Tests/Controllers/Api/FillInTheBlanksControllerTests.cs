using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.ViewModels.Api;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

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

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _controller = new FillInTheBlanksController(_entityFactory);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create question

        [TestMethod]
        public void CreateFillInTheBlank_ShouldReturnJsonErrorResult_WnenSectionIsNull()
        {
            var result = _controller.Create(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Section is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionNotFoundError");
        }

        [TestMethod]
        public void CreateFillInTheBlank_ShouldAddQuestionToSection()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var section = Substitute.For<Section>("Section title", CreatedBy);
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);

            _entityFactory.FillInTheBlanksQuestion(title, user).Returns(question);

            _controller.Create(section, title);

            section.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void CreateFillInTheBlank_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);

            _entityFactory.FillInTheBlanksQuestion(title, user).Returns(question);

            var result = _controller.Create(Substitute.For<Section>("Section title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region Update

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldReturnHttpNotFoundResult_WhenQuestionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.Update(null, String.Empty, null);

            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldRemoveAllAnswerOptions_WhenCollectionOfAnswerViewmodelEmpty()
        {
            //Arrange
            var question = FillInTheBlanksObjectMother.Create();
            var answersViewmodels = new List<BlankAnswerViewModel>();
            var answer1 = BlankAnswerObjectMother.Create();
            var answer2 = BlankAnswerObjectMother.Create();
            question.AddAnswer(answer1, CreatedBy);
            question.AddAnswer(answer2, CreatedBy);

            //Act
            _controller.Update(question, String.Empty, answersViewmodels);

            //Assert
            question.Answers.ToList().Count.Should().Be(0);
        }

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldUpdateAnswers()
        {
            const string fillInTheBlank = "updated content";
            var answerModel = new BlankAnswerViewModel() { GroupId = Guid.NewGuid(), IsCorrect = true, Text = "ololosh" };
            var answersViewmodel = new List<BlankAnswerViewModel>() { answerModel };
            _user.Identity.Name.Returns(CreatedBy);
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);

            _controller.Update(question, fillInTheBlank, answersViewmodel);

            question.Received().UpdateAnswers(Arg.Any<ICollection<BlankAnswer>>(), CreatedBy);
        }

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldUpdateQuestionContent()
        {
            const string fillInTheBlank = "updated content";
            var answersViewmodels = new List<BlankAnswerViewModel>();
            _user.Identity.Name.Returns(CreatedBy);
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);

            _controller.Update(question, fillInTheBlank, answersViewmodels);

            question.Received().UpdateContent(fillInTheBlank, CreatedBy);
        }

        [TestMethod]
        public void UpdateFillInTheBlank_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<FillInTheBlanks>("Question title", CreatedBy);
            var answers = new List<Answer>();
            var answersViewModel = new List<BlankAnswerViewModel>();

            var result = _controller.Update(question, String.Empty, answersViewModel);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Get

        [TestMethod]
        public void Get_ShouldReturnHttpNotFoundResult_WhenQuestionIsNull()
        {
            //Act
            var result = _controller.Get(null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void Get_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var question = FillInTheBlanksObjectMother.Create();
            question.AddAnswer(BlankAnswerObjectMother.Create(), "Some user");

            //Act
            var result = _controller.Get(question);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
