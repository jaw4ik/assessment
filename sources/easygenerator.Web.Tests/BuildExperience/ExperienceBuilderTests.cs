using System;
using System.Collections.Generic;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class ExperienceBuilderTests
    {
        private ExperienceBuilder _builder;
        private Mock<IBuildHelper> _buildHelper;


        [TestInitialize]
        public void InitializeContext()
        {
            _buildHelper = new Mock<IBuildHelper>();
            _builder = new ExperienceBuilder(_buildHelper.Object);
        }

        private static ExperienceBuildModel CreateDefaultBuildModel()
        {
            return new ExperienceBuildModel() { Id = "0", Objectives = new List<ObjectiveBuildModel>() };
        }

        [TestMethod]
        public void Build_ShouldReturnSuccess()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();

            //Act
            var result = _builder.Build(buildModel);

            //Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void Build_ShouldCreateBuildFolder()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            _buildHelper.Setup(instance => instance.CreateBuildDirectory(It.IsAny<string>()));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildHelper.Verify(instance => instance.CreateBuildDirectory("0"));
        }

        [TestMethod]
        public void Build_ShouldDeleteBuildFolder()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            _buildHelper.Setup(instance => instance.DeleteBuildDirectory(It.IsAny<string>()));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildHelper.Verify(instance => instance.DeleteBuildDirectory("0"));
        }

        [TestMethod]
        public void Build_ShouldCopyDefaultTemplate()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            _buildHelper.Setup(instance => instance.CopyTemplateToBuildDirectory(It.IsAny<string>(), It.IsAny<string>()));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildHelper.Verify(instance => instance.CopyTemplateToBuildDirectory("0", "Default"));
        }

        [TestMethod]
        public void Build_ShouldCreateFolderForObjectives()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            buildModel.Objectives.AddRange(new[]{
                new ObjectiveBuildModel() { Id = "1", Questions = new List<QuestionBuildModel>() },
                new ObjectiveBuildModel() { Id = "2", Questions = new List<QuestionBuildModel>() }
            });


            _buildHelper.Setup(instance => instance.CreateObjectiveDirectory(It.IsAny<String>(), It.IsAny<String>()));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildHelper.Verify(instance => instance.CreateObjectiveDirectory("0", "1"));
            _buildHelper.Verify(instance => instance.CreateObjectiveDirectory("0", "2"));
        }

        [TestMethod]
        public void Build_ShouldCreateFolderForQuestions()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            buildModel.Objectives.Add(
                new ObjectiveBuildModel()
                {
                    Id = "1", 
                    Questions = new List<QuestionBuildModel>()
                    {
                        new QuestionBuildModel() { Id = "1", Explanations = new List<ExplanationBuildModel>()},
                        new QuestionBuildModel() { Id = "2", Explanations = new List<ExplanationBuildModel>()},
                        new QuestionBuildModel() { Id = "3", Explanations = new List<ExplanationBuildModel>()}
                    }
                }
            );
            
            _buildHelper.Setup(instance => instance.CreateQuestionDirectory(It.IsAny<String>(), It.IsAny<string>(), It.IsAny<string>()));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildHelper.Verify(instance => instance.CreateQuestionDirectory("0", "1", "1"));
            _buildHelper.Verify(instance => instance.CreateQuestionDirectory("0", "1", "2"));
            _buildHelper.Verify(instance => instance.CreateQuestionDirectory("0", "1", "3"));
        }

        [TestMethod]
        public void Build_ShouldCreateExplanationFiles()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            buildModel.Objectives.Add(
                new ObjectiveBuildModel()
                {
                    Id = "1",
                    Questions = new List<QuestionBuildModel>()
                    {
                        new QuestionBuildModel()
                        { 
                            Id = "1", 
                            Explanations = new List<ExplanationBuildModel>()
                            {
                                new ExplanationBuildModel() { Id = "1", Text = "Some text 1" },
                                new ExplanationBuildModel() { Id = "2", Text = "Some text 2" },
                                new ExplanationBuildModel() { Id = "3", Text = "Some text 3" },
                            }
                        }
                    }
                }
            );

            _buildHelper.Setup(instance => instance.WriteExplanation(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<String>(), It.IsAny<string>(), It.IsAny<string>()));

            //Act
            _builder.Build(buildModel);

            //Assert
            //_buildHelper.Verify(instance => instance.WriteExplanations(It.IsAny<String>(), It.IsAny<String>(), buildModel.Objectives[0].Questions[0]));
            _buildHelper.Verify(instance => instance.WriteExplanation("0", "1", "1", "1", "Some text 1"));
            _buildHelper.Verify(instance => instance.WriteExplanation("0", "1", "1", "2", "Some text 2"));
            _buildHelper.Verify(instance => instance.WriteExplanation("0", "1", "1", "3", "Some text 3"));
        }

        [TestMethod]
        public void Build_ShouldClearExplanationTextInViewModel()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            buildModel.Objectives.Add(
                new ObjectiveBuildModel()
                {
                    Id = "1",
                    Questions = new List<QuestionBuildModel>()
                    {
                        new QuestionBuildModel()
                        {
                            Id = "1",
                            Explanations = new List<ExplanationBuildModel>()
                            {
                                new ExplanationBuildModel()
                                {
                                    Id = "1",
                                    Text = "Some text 1"
                                }
                            }
                        }
                    }
                }
            );

            //Act
            _builder.Build(buildModel);

            //Assert
            Assert.AreEqual("", buildModel.Objectives[0].Questions[0].Explanations[0].Text);
        }

        [TestMethod]
        public void Build_ShouldWriteJsonData()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            var serializedData = "serializedData";
            _buildHelper.Setup(instance => instance.SerializeBuildModel(It.IsAny<ExperienceBuildModel>())).Returns(serializedData);
            _buildHelper.Setup(instance => instance.WriteDataToFile(It.IsAny<string>(), It.IsAny<string>()));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildHelper.Verify(instance => instance.SerializeBuildModel(buildModel));
            _buildHelper.Verify(instance => instance.WriteDataToFile(buildModel.Id, serializedData));
        }

        [TestMethod]
        public void Build_ShouldArchiveExperience()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();

            _buildHelper.Setup(instance => instance.CreateBuildPackage(It.IsAny<string>()));
            
            //Act
            _builder.Build(buildModel);

            //Assert
            _buildHelper.Verify(instance => instance.CreateBuildPackage(buildModel.Id));
        }
    }
}
