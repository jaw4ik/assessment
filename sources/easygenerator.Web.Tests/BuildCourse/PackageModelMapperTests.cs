using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Extensions;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.BuildCourse
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

        private Course GetCourse()
        {
            var answer = AnswerObjectMother.Create("AnswerText", true);

            var question = QuestionObjectMother.Create("QuestionTitle");
            question.AddAnswer(answer, "SomeUser");

            DateTimeWrapper.Now = () => new DateTime(2013, 1, 1);
            question.AddLearningContent(LearningContentObjectMother.Create("LearningContent1"), "SomeUser");

            var objective = ObjectiveObjectMother.Create("ObjectiveTitle");
            objective.AddQuestion(question, "SomeUser");
            objective.Questions.First().UpdateContent("content", "someuser");

            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdateIntroductionContent("some content for course", "someUser");
            course.UpdateTemplate(TemplateObjectMother.Create(name: "Default"), "SomeUser");
            course.RelateObjective(objective, null, "SomeUser");

            return course;
        }

        #region Mapcourse

        [TestMethod]
        public void Mapcourse_ShouldThrowArgumentNullAxception_WhencourseIsNull()
        {
            //Arrange

            //Act
            Action action = () => _packageModelMapper.MapCourse(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void Mapcourse_ShouldReturnMappedLearningContentPackageModel()
        {
            //Arrange
            var course = GetCourse();

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            var expectedModel = course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0];
            var actualModel = result.Objectives[0].Questions[0].LearningContents[0];

            expectedModel.Id.ToNString().Should().Be(actualModel.Id);
            expectedModel.Text.Should().Be(actualModel.Text);
        }

        [TestMethod]
        public void Mapcourse_ShouldReturnMappedLearningContentPackageModel_OrderedByCreatedOnDate()
        {
            //Arrange
            var course = GetCourse();

            DateTimeWrapper.Now = () => new DateTime(2013, 1, 3);
            course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].AddLearningContent(LearningContentObjectMother.Create("LearningContent3"), "SomeUser");
            DateTimeWrapper.Now = () => new DateTime(2013, 1, 2);
            course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].AddLearningContent(LearningContentObjectMother.Create("LearningContent2"), "SomeUser");

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            var actualList = result.Objectives[0].Questions[0].LearningContents.Select(i => i.Text);
            actualList.Should().BeInAscendingOrder();
        }

        [TestMethod]
        public void Mapcourse_ShouldReturnMappedAnswerOptionPackageModel()
        {
            //Arrange
            var course = GetCourse();

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            var expectedModel = course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Answers.ToArray()[0];
            var actualModel = result.Objectives[0].Questions[0].Answers[0];

            expectedModel.Id.ToNString().Should().Be(actualModel.Id);
            expectedModel.Text.Should().Be(actualModel.Text);
            expectedModel.IsCorrect.Should().Be(actualModel.IsCorrect);
        }


        [TestMethod]
        public void Mapcourse_ShouldReturnMappedQuestionPackageModel()
        {
            //Arrange
            var course = GetCourse();

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            var expectedModel = course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0];
            var actualModel = result.Objectives[0].Questions[0];

            expectedModel.Id.ToNString().Should().Be(actualModel.Id);
            expectedModel.Title.Should().Be(actualModel.Title);
            expectedModel.Content.Should().Be(actualModel.Content);
            expectedModel.Answers.Count().Should().Be(actualModel.Answers.Count);
            expectedModel.LearningContents.Count().Should().Be(actualModel.LearningContents.Count);
        }

        [TestMethod]
        public void Mapcourse_ShouldMapQuestionHasContentPropertyAsFalse_WhenQuestionDoesntHaveContent()
        {
            //Arrange
            var course = GetCourse();
            var expectedModel = course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0];
            expectedModel.UpdateContent(null,"someUser");

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            var actualModel = result.Objectives[0].Questions[0];
            actualModel.HasContent.Should().BeFalse();
        }

        [TestMethod]
        public void Mapcourse_ShouldMapQuestionHasContentPropertyAsTrue_WhenQuestionHasContent()
        {
            //Arrange
            var course = GetCourse();
            var expectedModel = course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0];
            expectedModel.UpdateContent("content", "someUser");

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            var actualModel = result.Objectives[0].Questions[0];
            actualModel.HasContent.Should().BeTrue();
        }

        [TestMethod]
        public void Mapcourse_ShouldReturnMappedObjectivePackageModel()
        {
            //Arrange
            var course = GetCourse();

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            var expectedModel = course.RelatedObjectives.ToArray()[0];
            var actualModel = result.Objectives[0];

            expectedModel.Id.ToNString().Should().Be(actualModel.Id);
            expectedModel.Title.Should().Be(actualModel.Title);
            expectedModel.Questions.Count().Should().Be(actualModel.Questions.Count);
        }

        [TestMethod]
        public void Mapcourse_ShouldReturnMappedCoursePackageModel()
        {
            //Arrange
            var course = GetCourse();

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            var expectedModel = course;
            var actualModel = result;

            expectedModel.Id.ToNString().Should().Be(actualModel.Id);
            expectedModel.Title.Should().Be(actualModel.Title);
            expectedModel.RelatedObjectives.Count().Should().Be(actualModel.Objectives.Count);
        }

        [TestMethod]
        public void Mapcourse_ShouldIgnoreQuestionsWithoutAnswers()
        {
            //Arrange
            var course = GetCourse();
            var question = course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0];
            question.RemoveAnswer(question.Answers.ToArray()[0], "Me");

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            Assert.AreEqual(0, result.Objectives.Count);
        }

        [TestMethod]
        public void Mapcourse_ShouldIgnoreObjectivesWithoutQuestions()
        {
            //Arrange
            var course = GetCourse();
            var objective = course.RelatedObjectives.ToArray()[0];
            objective.RemoveQuestion(objective.Questions.ToArray()[0], "Me");

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            Assert.AreEqual(0, result.Objectives.Count);
        }

        [TestMethod]
        public void Mapcourse_ShouldIgnoreObjectivesWithFilteredQuestions()
        {
            //Arrange
            var course = GetCourse();
            var objective = course.RelatedObjectives.ToArray()[0];
            objective.Questions.ToArray()[0].RemoveAnswer(objective.Questions.ToArray()[0].Answers.ToArray()[0], "Me");

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            Assert.AreEqual(0, result.Objectives.Count);
        }

        [TestMethod]
        public void MapCourse_ShouldMapCourseHasIntroductionContentPropertyAsTrue_WhenCourseHasIntroductionContent()
        {
            //Arrange
            var course = GetCourse();
            course.UpdateIntroductionContent("content", "someUser");

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            result.HasIntroductionContent.Should().BeTrue();
        }

        [TestMethod]
        public void MapCourse_ShouldMapCourseHasIntroductionContentPropertyAsFalse_WhenCourseHasNotIntroductionContent()
        {
            //Arrange
            var course = GetCourse();
            course.UpdateIntroductionContent(null, "someUser");

            //Act
            var result = _packageModelMapper.MapCourse(course);

            //Assert
            result.HasIntroductionContent.Should().BeFalse();
        }

        #endregion
    }
}
