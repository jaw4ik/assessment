using System.Collections.Generic;
using System.IO;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class BuldHelperTests
    {
        private Mock<IPhysicalFileManager> _fileManager;
        private BuildHelper _buildHelper;

        [TestInitialize]
        public void InitializeContext()
        {
            _fileManager = new Mock<IPhysicalFileManager>();
            _buildHelper = new BuildHelper(_fileManager.Object);
        }

        [TestMethod]
        public void CreateBuildDirectory_ShouldCreateTempDirectory()
        {
            //Arrange
            string buildId = "BuildId";
            string buildDirectory = Path.Combine(BuildHelper.BuildPath, buildId);
            _fileManager.Setup(instance => instance.CreateDirectory(It.IsAny<string>()));

            //Act
            _buildHelper.CreateBuildDirectory(buildId);

            //Assert
            _fileManager.Verify(instance => instance.CreateDirectory(buildDirectory));
        }

        [TestMethod]
        public void DeleteBuildDirectory_ShouldDeleteTempDirectory()
        {
            //Arrange
            string buildId = "BuildId";
            string buildDirectory = Path.Combine(BuildHelper.BuildPath, buildId);
            _fileManager.Setup(instance => instance.DeleteDirectory(It.IsAny<string>()));

            //Act
            _buildHelper.DeleteBuildDirectory(buildId);

            //Assert
            _fileManager.Verify(instance => instance.DeleteDirectory(buildDirectory));
        }

        [TestMethod]
        public void CopyTemplateToBuildDirectory_ShouldCopyTemplateToBuildDirectory()
        {
            //Arrange
            string buildId = "BuildId";
            string templateName = "Default";
            string buildDirectory = Path.Combine(BuildHelper.BuildPath, buildId);
            string templateDirectory = Path.Combine(BuildHelper.TemplatePath, templateName);
            _fileManager.Setup(instance => instance.CopyDirectory(It.IsAny<string>(), It.IsAny<string>()));

            //Act
            _buildHelper.CopyTemplateToBuildDirectory(buildId, templateName);

            //Assert
            _fileManager.Verify(instance => instance.CopyDirectory(templateDirectory, buildDirectory));
        }

        [TestMethod]
        public void CopyTemplateToBuildDirectory_ShouldDeleteContentFolderFromTemplate()
        {
            //Arrange
            string buildId = "BuildId";
            string templateName = "Default";
            string buildDirectory = Path.Combine(BuildHelper.BuildPath, buildId, "content");
            _fileManager.Setup(instance => instance.DeleteDirectory(It.IsAny<string>()));

            //Act
            _buildHelper.CopyTemplateToBuildDirectory(buildId, templateName);

            //Assert
            _fileManager.Verify(instance => instance.DeleteDirectory(buildDirectory));
        }

        [TestMethod]
        public void CreateObjectiveDirectory_ShouldCreateObjectiveDirectoryInBuildPath()
        {
            //Arrange
            string buildId = "BuildId";
            string objectiveId = "ObjectiveId";
            string objectiveDirectory = Path.Combine(BuildHelper.BuildPath, buildId, "content", objectiveId);
            _fileManager.Setup(instance => instance.CreateDirectory(It.IsAny<string>()));

            //Act
            _buildHelper.CreateObjectiveDirectory(buildId, objectiveId);

            //Assert
            _fileManager.Verify(instance => instance.CreateDirectory(objectiveDirectory));
        }

        [TestMethod]
        public void CreateQuestionDirectory_ShouldCreateQuestionDirectoryInBuildPath()
        {
            //Arrange
            string buildId = "BuildId";
            string objectiveId = "ObjectiveId";
            string questionId = "QuestionId";
            string questionDirectory = Path.Combine(BuildHelper.BuildPath, buildId, "content", objectiveId, questionId);
            _fileManager.Setup(instance => instance.CreateDirectory(It.IsAny<string>()));

            //Act
            _buildHelper.CreateQuestionDirectory(buildId, objectiveId, questionId);

            //Assert
            _fileManager.Verify(instance => instance.CreateDirectory(questionDirectory));
        }

        [TestMethod]
        public void WriteExplanation_ShouldWriteExplanationInBuildPath()
        {
            //Arrange
            string buildId = "BuildId";
            string objectiveId = "ObjectiveId";
            string questionId = "QuestionId";
            string explanationId = "ExplanationId";
            string explanationText = "Explanation Text";
            string explanationFilePath = Path.Combine(BuildHelper.BuildPath, buildId, "content", objectiveId, questionId, explanationId + ".html");
            _fileManager.Setup(instance => instance.WriteToFile(It.IsAny<string>(), It.IsAny<string>()));

            //Act
            _buildHelper.WriteExplanation(buildId, objectiveId, questionId, explanationId, explanationText);

            //Assert
            _fileManager.Verify(instance => instance.WriteToFile(explanationFilePath, explanationText));
        }

        [TestMethod]
        public void WriteDataToFile_ShouldWriteSerializedDataToFile()
        {
            //Arrange
            string buildId = "BuildId";
            string serializedData = "Some data";
            string dataFilePath = Path.Combine(BuildHelper.BuildPath, buildId, "content", "data.js");
            _fileManager.Setup(instance => instance.WriteToFile(It.IsAny<string>(), It.IsAny<string>()));

            //Act
            _buildHelper.WriteDataToFile(buildId, serializedData);

            //Assert
            _fileManager.Verify(instance => instance.WriteToFile(dataFilePath, serializedData));
        }

        [TestMethod]
        public void SerializeBuildModel_ShouldSerializeBuildModel()
        {
            //Arrange
            ExperienceBuildModel buildModel = new ExperienceBuildModel()
            {
                Id = "0",
                Title = "Title",
                Objectives = new List<ObjectiveBuildModel>()
            };
            string serializedData = "{\"id\":\"0\",\"title\":\"Title\",\"objectives\":[]}";

            //Act
            var result = _buildHelper.SerializeBuildModel(buildModel);

            //Assert
            Assert.AreEqual(serializedData, result);
        }

        [TestMethod]
        public void CreateBuildPackage_ShouldDeletePreviousData()
        {
            //Arrange
            var buildId = "buildId";
            var packagePath = Path.Combine(BuildHelper.DownloadPath, buildId + ".zip");
            _fileManager.Setup(instance => instance.DeleteFile(It.IsAny<string>()));

            //Act
            _buildHelper.CreateBuildPackage(buildId);

            //Assert
            _fileManager.Verify(instance => instance.DeleteFile(packagePath));
        }

        [TestMethod]
        public void CreateBuildPackage_ShouldArchiveBuildDirectory()
        {
            //Arrange
            var buildId = "buildId";
            var packagePath = Path.Combine(BuildHelper.DownloadPath, buildId + ".zip");
            var buildPath = Path.Combine(BuildHelper.BuildPath, buildId);
            _fileManager.Setup(instance => instance.ArchiveDirectory(It.IsAny<string>(), It.IsAny<string>()));

            //Act
            _buildHelper.CreateBuildPackage(buildId);

            //Assert
            _fileManager.Verify(instance => instance.ArchiveDirectory(buildPath, packagePath));
        }
    }
}
