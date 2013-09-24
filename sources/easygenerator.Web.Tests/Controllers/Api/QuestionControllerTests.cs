using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
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

        IEntityFactory _entityFactory;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _controller = new QuestionController(_entityFactory);
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
            var question = Substitute.For<Question>();

            _entityFactory.Question(title).Returns(question);

            _controller.Create(objective, title);

            objective.Received().AddQuestion(question);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var question = Substitute.For<Question>();

            _entityFactory.Question(title).Returns(question);

            var result = _controller.Create(Substitute.For<Objective>(), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToString("N"), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region Delete question

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult_WnenObjectiveIsNull()
        {
            var result = _controller.Delete(null, null);

            result.Should()
                .BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveQuestionFromObjective()
        {
            var objective = Substitute.For<Objective>();
            var question = Substitute.For<Question>();

            _controller.Delete(objective, question);

            objective.Received().RemoveQuestion(question);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var objective = Substitute.For<Objective>();
            var question = Substitute.For<Question>();

            var result = _controller.Delete(objective, question);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = objective.ModifiedOn });
        }

        #endregion

        #region Update title

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult_WhenQuestionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = DateTime.MaxValue });
        }


        [TestMethod]
        public void Update_ShouldUpdateQuestionTitle()
        {
            const string title = "updated title";
            var question = Substitute.For<Question>();

            _controller.UpdateTitle(question, title);

            question.Received().UpdateTitle(title);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>();

            var result = _controller.UpdateTitle(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

    }
}
