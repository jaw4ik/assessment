using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class QuestionControllerTests
    {
        private QuestionController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _controller = new QuestionController();
        }

        #region Create question

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult_WnenObjectiveIsNull()
        {
            var result = _controller.Create(null, null);

            result.Should()
                .BeJsonSuccessResult();
        }

        [TestMethod]
        public void Create_ShouldAddQuestionToObjective()
        {
            const string title = "title";
            var objective = Substitute.For<Objective>();
            objective.AddQuestion(Arg.Any<string>()).Returns(QuestionObjectMother.Create());

            _controller.Create(objective, title);

            objective.Received().AddQuestion(title);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var question = QuestionObjectMother.Create();

            var objective = Substitute.For<Objective>();
            objective.AddQuestion(title).Returns(question);

           var result = _controller.Create(objective, title);

           result.Should()
               .BeJsonSuccessResult()
               .And.Data.ShouldBeSimilar(new { Id = question.Id.ToString("N"), CreatedOn = question.CreatedOn });
        }

        #endregion

    }
}
