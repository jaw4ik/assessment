using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class AnswerControllerTests
    {
        IPrincipal _user;
        HttpContextBase _context;
        IEntityFactory _entityFactory;

        AnswerController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new AnswerController(_entityFactory);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult_WnenQuestionIsNull()
        {
            const string text = "text";
            const bool isCorrect = true;
            var result = _controller.Create(null, text, isCorrect);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Create_ShouldAddAnswerToQuestion()
        {
            const string text = "text";
            const bool isCorrect = true;
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);

            var question = Substitute.For<Question>();
            var answer = Substitute.For<Answer>();

            _entityFactory.Answer(text, isCorrect, user).Returns(answer);

            _controller.Create(question, text, isCorrect);

            question.Received().AddAnswer(answer, user);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string text = "text";
            const bool isCorrect = true;
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var answer = Substitute.For<Answer>();

            _entityFactory.Answer(text, isCorrect, user).Returns(answer);

            var result = _controller.Create(Substitute.For<Question>(), text, isCorrect);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = answer.Id.ToString("N"), CreatedOn = answer.CreatedOn });
        }

        #endregion

        #region Delete question

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult_WnenQuestionIsNull()
        {
            var result = _controller.Delete(null, null);

            result.Should()
                .BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveAnswerFromQuestion()
        {
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>();
            var answer = Substitute.For<Answer>();

            _controller.Delete(question, answer);

            question.Received().RemoveAnswer(answer, user);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>();

            var result = _controller.Delete(question, Substitute.For<Answer>());

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Update text

        [TestMethod]
        public void UpdateText_ShouldReturnJsonSuccessResult_WhenAnswerIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateText(null, null);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = DateTime.MaxValue });
        }


        [TestMethod]
        public void UpdateText_ShouldUpdateAnswerText()
        {
            const string text = "updated text";
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var answer = Substitute.For<Answer>();

            _controller.UpdateText(answer, text);

            answer.Received().UpdateText(text, user);
        }

        [TestMethod]
        public void UpdateText_ShouldReturnJsonSuccessResult()
        {
            var answer = Substitute.For<Answer>();

            var result = _controller.UpdateText(answer, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = answer.ModifiedOn });
        }

        #endregion

        #region Update correctness

        [TestMethod]
        public void UpdateCorrectness_ShouldReturnJsonSuccessResult_WhenAnswerIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateCorrectness(null, true);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = DateTime.MaxValue });
        }


        [TestMethod]
        public void UpdateCorrectness_ShouldUpdateAnswerCorrectness()
        {
            const bool isCorrect = true;
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var answer = Substitute.For<Answer>();

            _controller.UpdateCorrectness(answer, isCorrect);

            answer.Received().UpdateCorrectness(isCorrect, user);
        }

        [TestMethod]
        public void UpdateCorrectness_ShouldReturnJsonSuccessResult()
        {
            var answer = Substitute.For<Answer>();

            var result = _controller.UpdateCorrectness(answer, true);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = answer.ModifiedOn });
        }

        #endregion
    }
}
