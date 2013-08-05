using System;
using System.Collections.Generic;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;
using easygenerator.Web.BuildExperience.PackageModel;
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

        #region MapExplanationBuildModel

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void ExplanationBuildModel_ShouldThrowArgumentNullAxception_WhenExplanationBuildModelIsNull()
        {
            //Arrange


            //Act
            _packageModelMapper.MapExplanationBuildModel(null);

            //Assert

        }

        [TestMethod]
        public void MapExplanationBuildModel_ShouldReturnMappedExplanationPackageModel()
        {
            //Arrange
            var explanationBuildModel = new ExplanationBuildModel() { Id = "0", Text = "Some text" };

            //Act
            var result = _packageModelMapper.MapExplanationBuildModel(explanationBuildModel);

            //Assert
            Assert.AreEqual(explanationBuildModel.Id, result.Id);
        }

        #endregion

        #region MapAnswerOptionBuildModel

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void MapAnswerOptionBuildModel_ShouldThrowArgumentNullAxception_WhenAnswerOptionBuildModelIsNull()
        {
            //Arrange


            //Act
            _packageModelMapper.MapAnswerOptionBuildModel(null);

            //Assert

        }

        [TestMethod]
        public void MapAnswerOptionBuildModel_ShouldReturnMappedAnswerOptionPackageModel()
        {
            //Arrange
            var answerOptionBuildModel = new AnswerOptionBuildModel() { Id = "0", Text = "Some text", IsCorrect = false };

            //Act
            var result = _packageModelMapper.MapAnswerOptionBuildModel(answerOptionBuildModel);

            //Assert
            Assert.AreEqual(answerOptionBuildModel.Id, result.Id);
            Assert.AreEqual(answerOptionBuildModel.Text, result.Text);
            Assert.AreEqual(answerOptionBuildModel.IsCorrect, result.IsCorrect);
        }

        #endregion

        #region MapQuestionBuildModel

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void MapQuestionBuildModel_ShouldThrowArgumentNullAxception_WhenQuestionBuildModelIsNull()
        {
            //Arrange


            //Act
            _packageModelMapper.MapQuestionBuildModel(null);

            //Assert

        }

        [TestMethod]
        public void MapQuestionBuildModel_ShouldReturnMappedQuestionPackageModel()
        {
            //Arrange
            var questionBuildModel = new QuestionBuildModel()
            {
                Id = "0",
                Title = "Some text",
                AnswerOptions = new List<AnswerOptionBuildModel>() { new AnswerOptionBuildModel() },
                Explanations = new List<ExplanationBuildModel>() { new ExplanationBuildModel() }
            };

            //Act
            var result = _packageModelMapper.MapQuestionBuildModel(questionBuildModel);

            //Assert
            Assert.AreEqual(questionBuildModel.Id, result.Id);
            Assert.AreEqual(questionBuildModel.Title, result.Title);
            Assert.AreEqual(questionBuildModel.AnswerOptions.Count, result.Answers.Count);
            Assert.AreEqual(questionBuildModel.Explanations.Count, result.Explanations.Count);
        }

        #endregion

        #region MapObjectiveBuildModel

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void MapObjectiveBuildModel_ShouldThrowArgumentNullAxception_WhenObjectiveBuildModelIsNull()
        {
            //Arrange


            //Act
            _packageModelMapper.MapObjectiveBuildModel(null);

            //Assert

        }

        [TestMethod]
        public void MapObjectiveBuildModel_ShouldReturnMappedObjectivePackageModel()
        {
            //Arrange
            var objectiveBuildModel = new ObjectiveBuildModel()
            {
                Id = "0",
                Title = "Some text",
                Image = "Some image url",
                Questions = new List<QuestionBuildModel>() 
                { 
                    new QuestionBuildModel() 
                    {
                        Id = "0",
                        Title = "Some text",
                        AnswerOptions = new List<AnswerOptionBuildModel>(),
                        Explanations = new List<ExplanationBuildModel>()
                    }
                }
            };

            //Act
            var result = _packageModelMapper.MapObjectiveBuildModel(objectiveBuildModel);

            //Assert
            Assert.AreEqual(objectiveBuildModel.Id, result.Id);
            Assert.AreEqual(objectiveBuildModel.Title, result.Title);
            Assert.AreEqual(objectiveBuildModel.Image, result.Image);
            Assert.AreEqual(objectiveBuildModel.Questions.Count, result.Questions.Count);
        }

        #endregion

        #region MapExperienceBuildModel

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void MapExperienceBuildModel_ShouldThrowArgumentNullAxception_WhenExperienceBuildModelIsNull()
        {
            //Arrange


            //Act
            _packageModelMapper.MapExperienceBuildModel(null);

            //Assert

        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldReturnMappedExperiencePackageModel()
        {
            //Arrange
            var experienceBuildModel = new ExperienceBuildModel()
            {
                Id = "0",
                Title = "Some experience title",
                Objectives = new List<ObjectiveBuildModel>() 
                { 
                    new ObjectiveBuildModel()
                    {
                        Id = "0",
                        Title = "Some text",
                        Image = "Some image url",
                        Questions = new List<QuestionBuildModel>() 
                        { 
                            new QuestionBuildModel() 
                            {
                                Id = "0",
                                Title = "Some text",
                                AnswerOptions = new List<AnswerOptionBuildModel>(),
                                Explanations = new List<ExplanationBuildModel>()
                            }
                        }
                    }
                }
            };

            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.AreEqual(experienceBuildModel.Id, result.Id);
            Assert.AreEqual(experienceBuildModel.Title, result.Title);
            Assert.AreEqual(experienceBuildModel.Objectives.Count, result.Objectives.Count);
        }

        #endregion


    }
}
