﻿using System;
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

        private ExperienceBuildModel GetExperienceBuildModel()
        {
            return new ExperienceBuildModel()
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
        public void MapExperienceBuildModel_ShouldReturnMappedExplanationPackageModel()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();

            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].Explanations[0].Id, result.Objectives[0].Questions[0].Explanations[0].Id);

        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldReturnMappedAnswerOptionPackageModel()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();

            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].AnswerOptions[0].Id, result.Objectives[0].Questions[0].Answers[0].Id);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].AnswerOptions[0].Text, result.Objectives[0].Questions[0].Answers[0].Text);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].AnswerOptions[0].IsCorrect, result.Objectives[0].Questions[0].Answers[0].IsCorrect);
        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldReturnMappedQuestionPackageModel()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();

            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].Id, result.Objectives[0].Questions[0].Id);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].Title, result.Objectives[0].Questions[0].Title);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].AnswerOptions.Count, result.Objectives[0].Questions[0].Answers.Count);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].Explanations.Count, result.Objectives[0].Questions[0].Explanations.Count);
        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldReturnMappedObjectivePackageModel()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();

            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.AreEqual(experienceBuildModel.Objectives[0].Id, result.Objectives[0].Id);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Title, result.Objectives[0].Title);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Image, result.Objectives[0].Image);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions.Count, result.Objectives[0].Questions.Count);
        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldReturnMappedExperiencePackageModel()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();

            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.AreEqual(experienceBuildModel.Id, result.Id);
            Assert.AreEqual(experienceBuildModel.Title, result.Title);
            Assert.AreEqual(experienceBuildModel.Objectives.Count, result.Objectives.Count);
        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldIgnoreQuestionsWithoutAnswerOptionsAndExplanations()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();
            experienceBuildModel.Objectives[0].Questions.Add(new QuestionBuildModel()
            {
                Id = "1",
                Title = "Some text1",
                AnswerOptions = null,
                Explanations = null
            });

            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.AreEqual(1, result.Objectives[0].Questions.Count);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Questions[0].Id, result.Objectives[0].Questions[0].Id);
        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldIgnoreObjectivesWithoutQuestions()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();
            experienceBuildModel.Objectives.Add(
                new ObjectiveBuildModel()
                    {
                        Id = "1",
                        Title = "Some text",
                        Image = "Some image url",
                        Questions = null
                    });
            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.AreEqual(1, result.Objectives.Count);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Id, result.Objectives[0].Id);
        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldIgnoreObjectivesWithFilteredQuestions()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();
            experienceBuildModel.Objectives.Add(
                new ObjectiveBuildModel()
                {
                    Id = "1",
                    Title = "Some text",
                    Image = "Some image url",
                    Questions = new List<QuestionBuildModel>()
                    {
                        new QuestionBuildModel()
                        {
                            Id = "Some Id",
                            AnswerOptions = null,
                            Explanations = null
                        }   
                    }
                });
            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.AreEqual(1, result.Objectives.Count);
            Assert.AreEqual(experienceBuildModel.Objectives[0].Id, result.Objectives[0].Id);
        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldReturnEmptyListOfAswers_WhenAswerOptionsIsNull()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();
            experienceBuildModel.Objectives[0].Questions.Add(new QuestionBuildModel()
            {
                Id = "1",
                Title = "Some text1",
                AnswerOptions = null,
                Explanations = new List<ExplanationBuildModel>() { new ExplanationBuildModel() { Id = "Some Id", Text = "Some Text" } }
            });
            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.IsNotNull(result.Objectives[0].Questions[1].Answers);
        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldReturnEmptyListOfExplanations_WhenSourceExplanationsIsNull()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();
            experienceBuildModel.Objectives[0].Questions.Add(new QuestionBuildModel()
            {
                Id = "1",
                Title = "Some text1",
                AnswerOptions = new List<AnswerOptionBuildModel>() { new AnswerOptionBuildModel() { Id = "Some Id", IsCorrect = true, Text = "Some text" } },
                Explanations = null
            });
            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.IsNotNull(result.Objectives[0].Questions[1].Explanations);
        }

        [TestMethod]
        public void MapExperienceBuildModel_ShouldReturnEmptyListOfObjectives_WhenSourceObjectivesIsNull()
        {
            //Arrange
            var experienceBuildModel = GetExperienceBuildModel();
            experienceBuildModel.Objectives = null;
            //Act
            var result = _packageModelMapper.MapExperienceBuildModel(experienceBuildModel);

            //Assert
            Assert.IsNotNull(result.Objectives);
        }

        #endregion
    }
}
