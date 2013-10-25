using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.BuildExperience;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class PackageModelMapperTests
    {
        private PackageModelMapper _packageModelMapper;

        [TestInitialize]
        public void InitializeContext()
        {
            _packageModelMapper = new PackageModelMapper();
        }

        private Experience GetExperience()
        {
            var answer = AnswerObjectMother.Create("AnswerText", true);
            var explanation = LearningContentObjectMother.Create("Text");

            var question = QuestionObjectMother.Create("QuestionTitle");
            question.AddAnswer(answer, "SomeUser");
            question.AddLearningContent(explanation, "SomeUser");

            var objective = ObjectiveObjectMother.Create("ObjectiveTitle");
            objective.AddQuestion(question, "SomeUser");

            var experience = ExperienceObjectMother.Create("ExperienceTitle");
            experience.UpdateTemplate(TemplateObjectMother.Create(name: "Default"), "SomeUser");
            experience.RelateObjective(objective, "SomeUser");

            return experience;
        }

        #region Mapexperience

        [TestMethod]
        public void Mapexperience_ShouldThrowArgumentNullAxception_WhenexperienceIsNull()
        {
            //Arrange

            //Act
            Action action = () => _packageModelMapper.MapExperience(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void Mapexperience_ShouldReturnMappedLearningContentPackageModel()
        {
            //Arrange
            var experience = GetExperience();

            //Act
            var result = _packageModelMapper.MapExperience(experience);

            //Assert
            var expectedModel = experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0];
            var actualModel = result.Objectives[0].Questions[0].LearningContents[0];

            expectedModel.Id.ToString("N").Should().Be(actualModel.Id);
        }
        
        [TestMethod]
        public void Mapexperience_ShouldReturnMappedAnswerOptionPackageModel()
        {
            //Arrange
            var experience = GetExperience();

            //Act
            var result = _packageModelMapper.MapExperience(experience);

            //Assert
            var expectedModel = experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Answers.ToArray()[0];
            var actualModel = result.Objectives[0].Questions[0].Answers[0];

            expectedModel.Id.ToString("N").Should().Be(actualModel.Id);
            expectedModel.Text.Should().Be(actualModel.Text);
            expectedModel.IsCorrect.Should().Be(actualModel.IsCorrect);
        }

        
        [TestMethod]
        public void Mapexperience_ShouldReturnMappedQuestionPackageModel()
        {
            //Arrange
            var experience = GetExperience();

            //Act
            var result = _packageModelMapper.MapExperience(experience);

            //Assert
            var expectedModel = experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0];
            var actualModel = result.Objectives[0].Questions[0];

            expectedModel.Id.ToString("N").Should().Be(actualModel.Id);
            expectedModel.Title.Should().Be(actualModel.Title);
            expectedModel.Answers.Count().Should().Be(actualModel.Answers.Count);
            expectedModel.LearningContents.Count().Should().Be(actualModel.LearningContents.Count);
        }
        
        [TestMethod]
        public void Mapexperience_ShouldReturnMappedObjectivePackageModel()
        {
            //Arrange
            var experience = GetExperience();

            //Act
            var result = _packageModelMapper.MapExperience(experience);

            //Assert
            var expectedModel = experience.RelatedObjectives.ToArray()[0];
            var actualModel = result.Objectives[0];

            expectedModel.Id.ToString("N").Should().Be(actualModel.Id);
            expectedModel.Title.Should().Be(actualModel.Title);
            expectedModel.Questions.Count().Should().Be(actualModel.Questions.Count);
        }
        
        [TestMethod]
        public void Mapexperience_ShouldReturnMappedExperiencePackageModel()
        {
            //Arrange
            var experience = GetExperience();

            //Act
            var result = _packageModelMapper.MapExperience(experience);

            //Assert
            var expectedModel = experience;
            var actualModel = result;

            expectedModel.Id.ToString("N").Should().Be(actualModel.Id);
            expectedModel.Title.Should().Be(actualModel.Title);
            expectedModel.RelatedObjectives.Count().Should().Be(actualModel.Objectives.Count);
        }
        
        [TestMethod]
        public void Mapexperience_ShouldIgnoreQuestionsWithoutAnswers()
        {
            //Arrange
            var experience = GetExperience();
            var question = experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0];
            question.RemoveAnswer(question.Answers.ToArray()[0], "Me");

            //Act
            var result = _packageModelMapper.MapExperience(experience);

            //Assert
            Assert.AreEqual(0, result.Objectives.Count);
        }
        
        [TestMethod]
        public void Mapexperience_ShouldIgnoreObjectivesWithoutQuestions()
        {
            //Arrange
            var experience = GetExperience();
            var objective = experience.RelatedObjectives.ToArray()[0];
            objective.RemoveQuestion(objective.Questions.ToArray()[0], "Me");

            //Act
            var result = _packageModelMapper.MapExperience(experience);

            //Assert
            Assert.AreEqual(0, result.Objectives.Count);
        }
        
        [TestMethod]
        public void Mapexperience_ShouldIgnoreObjectivesWithFilteredQuestions()
        {
            //Arrange
            var experience = GetExperience();
            var objective = experience.RelatedObjectives.ToArray()[0];
            objective.Questions.ToArray()[0].RemoveAnswer(objective.Questions.ToArray()[0].Answers.ToArray()[0], "Me");

            //Act
            var result = _packageModelMapper.MapExperience(experience);

            //Assert
            Assert.AreEqual(0, result.Objectives.Count);
        }
        
        #endregion
    }
}
