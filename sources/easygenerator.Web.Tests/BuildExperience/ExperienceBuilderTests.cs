using System;
using System.Collections.Generic;
using easygenerator.Infrastructure;
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
        private Mock<PhysicalFileManager> _fileManager;
        private Mock<HttpRuntimeWrapper> _httpRuntimeWrapperMock;
        private Mock<BuildPathProvider> _buildPathProviderMock;


        [TestInitialize]
        public void InitializeContext()
        {
            _fileManager = new Mock<PhysicalFileManager>();

            _httpRuntimeWrapperMock = new Mock<HttpRuntimeWrapper>();
            _httpRuntimeWrapperMock.Setup(instance => instance.GetDomainAppPath()).Returns(String.Empty);

            _buildPathProviderMock = new Mock<BuildPathProvider>(_httpRuntimeWrapperMock.Object);

            _builder = new ExperienceBuilder(_fileManager.Object, _buildPathProviderMock.Object);
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
            string buildPath = "Some path";

            _buildPathProviderMock.Setup(instance => instance.GetBuildDirectoryName(buildModel.Id)).Returns(buildPath);
            _fileManager.Setup(instance => instance.CreateDirectory(buildPath));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.Verify(instance => instance.GetBuildDirectoryName(buildModel.Id));
            _fileManager.Verify(instance => instance.CreateDirectory(buildPath));
        }

        [TestMethod]
        public void Build_ShouldDeleteBuildFolder()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();

            string buildPath = "Some path";

            _buildPathProviderMock.Setup(instance => instance.GetBuildDirectoryName(buildModel.Id)).Returns(buildPath);
            _fileManager.Setup(instance => instance.DeleteDirectory(buildPath));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.Verify(instance => instance.GetBuildDirectoryName(buildModel.Id));
            _fileManager.Verify(instance => instance.DeleteDirectory(buildPath));
        }

        [TestMethod]
        public void Build_ShouldCopyDefaultTemplate()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            string buildPath = "Some path";
            string templatePath = "Some template path";

            _buildPathProviderMock.Setup(instance => instance.GetBuildDirectoryName(buildModel.Id)).Returns(buildPath);
            _buildPathProviderMock.Setup(instance => instance.GetTemplateDirectoryName(It.IsAny<string>())).Returns(templatePath);
            _fileManager.Setup(instance => instance.CopyDirectory(templatePath, buildPath));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.VerifyAll();
            _fileManager.Verify(instance => instance.CopyDirectory(templatePath, buildPath));
        }

        [TestMethod]
        public void Build_ShouldCreateFolderForObjectives()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            buildModel.Objectives.Add(
                 new ObjectiveBuildModel()
                 {
                     Id = "0",
                     Questions = new List<QuestionBuildModel>()
                 }
             );

            var objectivePath = "Some objective path";

            _buildPathProviderMock.Setup(instance => instance.GetObjectiveDirectoryName(It.IsAny<string>(), It.IsAny<string>())).Returns(objectivePath);
            _fileManager.Setup(instance => instance.CreateDirectory(objectivePath));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.VerifyAll();
            _fileManager.Verify(instance => instance.CreateDirectory(objectivePath));
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
                         new QuestionBuildModel() { Id = "1", Explanations = new List<ExplanationBuildModel>()}
                     }
                }
            );
            var questionPath = "Some question path";

            _buildPathProviderMock.Setup(instance => instance.GetQuestionDirectoryName(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(questionPath);
            _fileManager.Setup(instance => instance.CreateDirectory(questionPath));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.VerifyAll();
            _fileManager.Verify(instance => instance.CreateDirectory(questionPath));
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
                                 new ExplanationBuildModel() { Id = "1", Text = "Some text 1" }
                             }
                         }
                     }
                }
            );
            var explanationFileName = "Some explanation file name";

            _buildPathProviderMock.Setup(instance => instance.GetExplanationFileName(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(explanationFileName);
            _fileManager.Setup(instance => instance.WriteToFile(explanationFileName, It.IsAny<string>()));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.VerifyAll();
            _fileManager.Verify(instance => instance.WriteToFile(explanationFileName, It.IsAny<string>()));
        }

        [TestMethod]
        public void Build_ShouldClearExplanationTextInViewModel()
        {
            //Arrange
            var buildModel = CreateDefaultBuildModel();
            buildModel.Objectives.Add(new ObjectiveBuildModel()
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
                });

            //Act
            _builder.Build(buildModel);

            //Assert
            Assert.AreEqual(String.Empty, buildModel.Objectives[0].Questions[0].Explanations[0].Text);
        }

        /*   [TestMethod]
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
           }*/
    }
}
