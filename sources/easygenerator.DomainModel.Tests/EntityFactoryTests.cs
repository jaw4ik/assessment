using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;

namespace easygenerator.DomainModel.Tests
{
    [TestClass]
    public class EntityFactoryTests
    {
        private IEntityFactory _entityFactory;
        private const string ModifiedBy = "easygenerator@easygenerator.com";

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = new EntityFactory();
        }

        [TestMethod]
        public void Objective_ShouldCreateObjective()
        {
            const string title = "title";

            var objective = _entityFactory.Objective(title, ModifiedBy);

            objective.Should().NotBeNull();
            objective.Title.Should().Be(title);
        }

        [TestMethod]
        public void Experience_ShouldCreateExperience()
        {
            const string title = "title";
            var template = TemplateObjectMother.Create();

            var experience = _entityFactory.Experience(title, template, ModifiedBy);

            experience.Should().NotBeNull();
            experience.Title.Should().Be(title);
            experience.Template.Should().Be(template);
        }

        [TestMethod]
        public void Question_ShouldCreateQuestion()
        {
            const string title = "title";

            var question = _entityFactory.Question(title, ModifiedBy);
            question.Should().NotBeNull();
            question.Title.Should().Be(title);
        }

        [TestMethod]
        public void Answer_ShouldCreateAnswer()
        {
            const string text = "text";
            const bool isCorrect = true;

            var question = _entityFactory.Answer(text, isCorrect, ModifiedBy);
            question.Should().NotBeNull();
            question.Text.Should().Be(text);
            question.IsCorrect.Should().Be(isCorrect);
        }

        [TestMethod]
        public void Explanation_ShouldCreateExplanation()
        {
            const string text = "text";

            var explanation = _entityFactory.LearningContent(text, ModifiedBy);
            explanation.Should().NotBeNull();
            explanation.Text.Should().Be(text);
        }

        [TestMethod]
        public void User_ShouldCreateUser()
        {
            const string email = "easygenerator@easygenerator.com";
            const string password = "Easy123!";

            var user = _entityFactory.User(email, password, ModifiedBy);
            user.Should().NotBeNull();
            user.Email.Should().Be(email);
            user.VerifyPassword(password).Should().BeTrue();
        }

        [TestMethod]
        public void HelpHint_ShouldCreateHelpHint()
        {
            const string createdBy = "easygenerator@easygenerator.com";
            const string name = "experiences";

            var helpHint = _entityFactory.HelpHint(name, ModifiedBy);
            helpHint.Should().NotBeNull();
            helpHint.Name.Should().Be(name);
            helpHint.CreatedBy.Should().Be(createdBy);
        }
    }
}

