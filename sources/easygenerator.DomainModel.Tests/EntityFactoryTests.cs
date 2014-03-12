using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
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
        public void Course_ShouldCreateCourse()
        {
            const string title = "title";
            var template = TemplateObjectMother.Create();

            var course = _entityFactory.Course(title, template, ModifiedBy);

            course.Should().NotBeNull();
            course.Title.Should().Be(title);
            course.Template.Should().Be(template);
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
            var firstname = "easygenerator user firstname";
            var lastname = "easygenerator user lastname";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";

            var user = _entityFactory.User(email, password, firstname, lastname, phone, organization, country, ModifiedBy, UserSettingsObjectMother.Create(), AccessType.Starter, DateTimeWrapper.Now());
            user.Should().NotBeNull();
            user.Email.Should().Be(email);
            user.VerifyPassword(password).Should().BeTrue();
        }

        [TestMethod]
        public void ImageFile_ShouldCreateImageFileObject()
        {
            //Arrange
            var imageTitle = "image.jpg";
            var createdBy = "author@easygenerator.com";

            //Act
            var imageFile = _entityFactory.ImageFile(imageTitle, createdBy);

            //Assert
            imageFile.Should().NotBeNull();
            imageFile.Title.Should().Be(imageTitle);
            imageFile.CreatedBy.Should().Be(createdBy);
            imageFile.ModifiedBy.Should().Be(createdBy);
        }
    }
}

