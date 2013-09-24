﻿using System;
using System.Collections.Generic;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.PackageModel;
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
        private Mock<BuildPackageCreator> _buildPackageCreatorMock;

        private Mock<PackageModelSerializer> _packageModelSerializerMock;

        [TestInitialize]
        public void InitializeContext()
        {
            _fileManager = new Mock<PhysicalFileManager>();

            _httpRuntimeWrapperMock = new Mock<HttpRuntimeWrapper>();
            _httpRuntimeWrapperMock.Setup(instance => instance.GetDomainAppPath()).Returns(String.Empty);

            _buildPathProviderMock = new Mock<BuildPathProvider>(_httpRuntimeWrapperMock.Object);

            _buildPackageCreatorMock = new Mock<BuildPackageCreator>(_fileManager.Object);

            DateTimeWrapper.Now = () => new DateTime(2013, 10, 12);

            _packageModelSerializerMock = new Mock<PackageModelSerializer>();

            _builder = new ExperienceBuilder(_fileManager.Object, _buildPathProviderMock.Object, _buildPackageCreatorMock.Object,
                _packageModelSerializerMock.Object);
        }

        private static ExperiencePackageModel CreateDefaultPackageModel()
        {
            return new ExperiencePackageModel() { Id = "0", TemplateName = "Default", Objectives = new List<ObjectivePackageModel>() };
        }

        [TestMethod]
        public void Build_ShouldReturnSuccess()
        {
            //Arrange
            var buildModel = CreateDefaultPackageModel();

            //Act
            var result = _builder.Build(buildModel);

            //Assert
            Assert.IsTrue(result.Success);
        }

        [TestMethod]
        public void Build_ShouldReturnPackageUrl()
        {
            //Arrange
            var buildModel = CreateDefaultPackageModel();
            var packageUrl = String.Format(buildModel.Id + " {0:yyyyMMdd-HH-mm-ss}-UTC.zip", DateTimeWrapper.Now().ToUniversalTime());

            //Act
            var result = _builder.Build(buildModel);

            //Assert
            Assert.AreEqual(result.PackageUrl, packageUrl);
        }

        [TestMethod]
        public void Build_ShouldCreateBuildFolder()
        {
            //Arrange
            var buildModel = CreateDefaultPackageModel();
            string buildPath = "Some path";
            var packageUrl = String.Format(buildModel.Id + " {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now().ToUniversalTime());

            _buildPathProviderMock.Setup(instance => instance.GetBuildDirectoryName(packageUrl)).Returns(buildPath);
            _fileManager.Setup(instance => instance.CreateDirectory(buildPath));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.Verify(instance => instance.GetBuildDirectoryName(packageUrl));
            _fileManager.Verify(instance => instance.CreateDirectory(buildPath));
        }

        [TestMethod]
        public void Build_ShouldDeleteBuildFolder()
        {
            //Arrange
            var buildModel = CreateDefaultPackageModel();

            var packageUrl = String.Format(buildModel.Id + " {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now().ToUniversalTime());
            string buildPath = "Some path";

            _buildPathProviderMock.Setup(instance => instance.GetBuildDirectoryName(packageUrl)).Returns(buildPath);
            _fileManager.Setup(instance => instance.DeleteDirectory(buildPath));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.Verify(instance => instance.GetBuildDirectoryName(packageUrl));
            _fileManager.Verify(instance => instance.DeleteDirectory(buildPath));
        }

        [TestMethod]
        public void Build_ShouldCopyTemplate()
        {
            //Arrange
            var buildModel = CreateDefaultPackageModel();
            string buildPath = "Some path";
            string templatePath = "Some template path";
            var packageUrl = String.Format(buildModel.Id + " {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now().ToUniversalTime());

            _buildPathProviderMock.Setup(instance => instance.GetBuildDirectoryName(packageUrl)).Returns(buildPath);
            _buildPathProviderMock.Setup(instance => instance.GetTemplateDirectoryName(buildModel.TemplateName)).Returns(templatePath);
            _fileManager.Setup(instance => instance.CopyDirectory(templatePath, buildPath));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.VerifyAll();
            _fileManager.Verify(instance => instance.CopyDirectory(templatePath, buildPath));
        }

        [TestMethod]
        public void Build_ShouldRecreateContentFolder()
        {
            //Arrange
            var buildModel = CreateDefaultPackageModel();
            string contentPath = "Some path";
            var packageUrl = String.Format(buildModel.Id + " {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now().ToUniversalTime());

            int callOrder = 0;
            _buildPathProviderMock.Setup(instance => instance.GetContentDirectoryName(packageUrl)).Returns(contentPath);
            _fileManager.Setup(instance => instance.DeleteDirectory(contentPath)).Callback(() => Assert.AreEqual(0, callOrder++));
            _fileManager.Setup(instance => instance.CreateDirectory(contentPath)).Callback(() => Assert.AreEqual(1, callOrder++));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.VerifyAll();
            _fileManager.VerifyAll();
        }

        [TestMethod]
        public void Build_ShouldCreateFolderForObjectives()
        {
            //Arrange
            var buildModel = CreateDefaultPackageModel();
            buildModel.Objectives.Add(
                 new ObjectivePackageModel()
                 {
                     Id = "0",
                     Questions = new List<QuestionPackageModel>()
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
            var buildModel = CreateDefaultPackageModel();
            buildModel.Objectives.Add(
                new ObjectivePackageModel()
                {
                    Id = "1",
                    Questions = new List<QuestionPackageModel>()
                     {
                         new QuestionPackageModel() { Id = "1", LearningObjects = new List<LearningObjectPackageModel>()}
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
        public void Build_ShouldCreateLearningObjectsFiles()
        {
            //Arrange
            var buildModel = CreateDefaultPackageModel();
            buildModel.Objectives.Add(
                new ObjectivePackageModel()
                {
                    Id = "1",
                    Questions = new List<QuestionPackageModel>()
                     {
                         new QuestionPackageModel()
                         { 
                             Id = "1", 
                             LearningObjects = new List<LearningObjectPackageModel>()
                             {
                                 new LearningObjectPackageModel() { Id = "1", Text = "Some text 1" }
                             }
                         }
                     }
                }
            );
            var learningObjectFileName = "Some learning object file name";

            _buildPathProviderMock.Setup(instance => instance.GetLearningObjectFileName(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(learningObjectFileName);
            _fileManager.Setup(instance => instance.WriteToFile(learningObjectFileName, It.IsAny<string>()));

            //Act
            _builder.Build(buildModel);

            //Assert
            _buildPathProviderMock.VerifyAll();
            _fileManager.Verify(instance => instance.WriteToFile(learningObjectFileName, It.IsAny<string>()));
        }

        [TestMethod]
        public void Build_ShouldSerializePackageModel()
        {
            //Arrange
            var buildModel = CreateDefaultPackageModel();
            _packageModelSerializerMock.Setup(instance => instance.Serialize(buildModel));

            //Act
            _builder.Build(buildModel);

            //Assert
            _packageModelSerializerMock.VerifyAll();
        }
    }
}
