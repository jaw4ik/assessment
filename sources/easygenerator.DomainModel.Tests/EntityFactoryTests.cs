using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.DomainModel.Tests.ObjectMothers;

namespace easygenerator.DomainModel.Tests
{
    [TestClass]
    public class EntityFactoryTests
    {
        private IEntityFactory _entityFactory;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = new EntityFactory();
        }

        [TestMethod]
        public void Objective_ShouldCreateObjective()
        {
            const string title = "title";

            var objective = _entityFactory.Objective(title);

            objective.Should().NotBeNull();
            objective.Title.Should().Be(title);
        }

        [TestMethod]
        public void Experience_ShouldCreateExperience()
        {
            const string title = "title";
            var template = TemplateObjectMother.Create();

            var experience = _entityFactory.Experience(title, template);

            experience.Should().NotBeNull();
            experience.Title.Should().Be(title);
            experience.Template.Should().Be(template);
        }

        [TestMethod]
        public void Question_ShouldCreateQuestion()
        {
            const string title = "title";

            var question = _entityFactory.Question(title);
            question.Should().NotBeNull();
            question.Title.Should().Be(title);
        }

        [TestMethod]
        public void Answer_ShouldCreateAnswer()
        {
            const string text = "text";
            const bool isCorrect = true;

            var question = _entityFactory.Answer(text, isCorrect);
            question.Should().NotBeNull();
            question.Text.Should().Be(text);
            question.IsCorrect.Should().Be(isCorrect);
        }

        [TestMethod]
        public void Explanation_ShouldCreateExplanation()
        {
            const string text = "text";

            var explanation = _entityFactory.Explanation(text);
            explanation.Should().NotBeNull();
            explanation.Text.Should().Be(text);
        }
    }
}
