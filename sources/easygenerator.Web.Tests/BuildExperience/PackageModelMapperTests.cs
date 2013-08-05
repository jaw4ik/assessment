using System;
using System.Collections.Generic;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;
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
                                AnswerOptions = new List<AnswerOptionBuildModel>() { new AnswerOptionBuildModel() {Id = "0", Text = "Some text" , IsCorrect = false}},
                                Explanations = new List<ExplanationBuildModel>() {new ExplanationBuildModel() { Id = "0", Text = "Some explanaion text"}}
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


            Assert.AreEqual(experienceBuildModel.Objectives[0].Id, result.Objectives[0].Id);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Title, result.Objectives[0].Title);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Image, result.Objectives[0].Image);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions.Count, result.Objectives[0].Questions.Count);

            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].Id, result.Objectives[0].Questions[0].Id);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].Title, result.Objectives[0].Questions[0].Title);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].AnswerOptions.Count, result.Objectives[0].Questions[0].Answers.Count);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].Explanations.Count, result.Objectives[0].Questions[0].Explanations.Count);

            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].AnswerOptions[0].Id, result.Objectives[0].Questions[0].Answers[0].Id);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].AnswerOptions[0].Text, result.Objectives[0].Questions[0].Answers[0].Text);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].AnswerOptions[0].IsCorrect, result.Objectives[0].Questions[0].Answers[0].IsCorrect);

            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].Explanations[0].Id, result.Objectives[0].Questions[0].Explanations[0].Id);

        }

        #endregion
    }
}
