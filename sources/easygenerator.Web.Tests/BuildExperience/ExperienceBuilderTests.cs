using System;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.PackageModel;
using easygenerator.Web.Components;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using FluentAssertions;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class ExperienceBuilderTests
    {
        private ExperienceBuilder _builder;
        private PhysicalFileManager _fileManager;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private BuildPathProvider _buildPathProvider;
        private BuildPackageCreator _buildPackageCreator;

        private PackageModelSerializer _packageModelSerializer;
        private PackageModelMapper _packageModelMapper;

        private Experience _experience;
        private ExperiencePackageModel _experiencePackageModel;

        [TestInitialize]
        public void InitializeContext()
        {
            _experience = GetExperienceToBuild();
            _experiencePackageModel = new PackageModelMapper().MapExperience(_experience);

            _fileManager = Substitute.For<PhysicalFileManager>();

            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns(string.Empty);

            _buildPathProvider = Substitute.For<BuildPathProvider>(_httpRuntimeWrapper);
            _buildPackageCreator = Substitute.For<BuildPackageCreator>(_fileManager);
            DateTimeWrapper.Now = () => new DateTime(2013, 10, 12);

            _packageModelMapper = Substitute.For<PackageModelMapper>();
            _packageModelMapper.MapExperience(_experience).Returns(_experiencePackageModel);

            _packageModelSerializer = Substitute.For<PackageModelSerializer>();

            _builder = new ExperienceBuilder(_fileManager, _buildPathProvider, _buildPackageCreator, _packageModelSerializer, _packageModelMapper);
        }

        private Experience GetExperienceToBuild()
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

        #region Build

        [TestMethod]
        public void Build_ShouldCreateBuildDirectory()
        {
            //Arrange
            var buildDirectory = "SomeDirectoryPath";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().CreateDirectory(buildDirectory);
        }


        [TestMethod]
        public void Build_ShouldTemplateToBuildDirectory()
        {
            //Arrange
            var buildDirectory = "SomeDirectoryPath";
            var templateDirectory = "SomeTemplatePath";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetTemplateDirectoryName(_experience.Template.Name).Returns(templateDirectory);
            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().CopyDirectory(templateDirectory, buildDirectory);
        }

        [TestMethod]
        public void Build_ShouldDeleteContentDirectory()
        {
            //Arrange
            var contentDirectory = "SomeContentPath";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetContentDirectoryName(buildId).Returns(contentDirectory);

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().DeleteDirectory(contentDirectory);
        }

        [TestMethod]
        public void Build_ShouldCreateContentDirectory()
        {
            //Arrange
            var contentDirectory = "SomeContentPath";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetContentDirectoryName(buildId).Returns(contentDirectory);

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().CreateDirectory(contentDirectory);
        }

        [TestMethod]
        public void Build_ShouldCreateObjectiveDirectory()
        {
            //Arrange
            var objectiveDirectory = "SomeObjectivePath";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetObjectiveDirectoryName(buildId, _experience.RelatedObjectives.ToArray()[0].Id.ToString("N")).Returns(objectiveDirectory);

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().CreateDirectory(objectiveDirectory);
        }

        [TestMethod]
        public void Build_ShouldCreateQuestionDirectory()
        {
            //Arrange
            var questionDirectory = "SomeQuestionPath";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetQuestionDirectoryName(buildId,
                _experience.RelatedObjectives.ToArray()[0].Id.ToString("N"),
                _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToString("N"))
                .Returns(questionDirectory);

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().CreateDirectory(questionDirectory);
        }

        [TestMethod]
        public void Build_ShouldWriteExplanationsToFile()
        {
            //Arrange
            var explanationFilePath = "SomeExplanationPath";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetLearningContentFileName(buildId,
                _experience.RelatedObjectives.ToArray()[0].Id.ToString("N"),
                _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToString("N"),
                _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0].Id.ToString("N"))
                .Returns(explanationFilePath);

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().WriteToFile(explanationFilePath, _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0].Text);
        }

        [TestMethod]
        public void Build_ShouldWriteSerializedPackageModelToFile()
        {
            //Arrange
            var packageModelFilePath = "SomePackageModelPath";
            var serializedPackageModel = "SomePackageModelData";

            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetDataFileName(buildId).Returns(packageModelFilePath);
            _packageModelSerializer.Serialize(_experiencePackageModel).Returns(serializedPackageModel);

            //Act
            _builder.Build(_experience);

            //Assert
            _packageModelSerializer.Received().Serialize(_experiencePackageModel);
            _fileManager.Received().WriteToFile(packageModelFilePath, serializedPackageModel);
        }

        [TestMethod]
        public void Build_ShouldWriteExperienceTemplateSettingsToFile()
        {
            //Arrange
            const string settingsFileName = "settingsFileName";
            const string settings = "settings";

            var experience = Substitute.For<Experience>();
            experience.Template.Returns(Substitute.For<Template>());
            experience.GetTemplateSettings(experience.Template).Returns(settings);

            _packageModelMapper.MapExperience(experience).Returns(_experiencePackageModel);
            _buildPathProvider.GetSettingsFileName(Arg.Any<string>()).Returns(settingsFileName);

            //Act
            _builder.Build(experience);

            //Assert
            _fileManager.Received().WriteToFile(settingsFileName, settings);
        }

        [TestMethod]
        public void Build_ShouldCreatePackage()
        {
            //Arrange
            var buildDirectory = "SomeBuildPath";
            var buildPackageFileName = "SomePackageFileName";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);
            _buildPathProvider.GetBuildPackageFileName(buildId).Returns(buildPackageFileName);

            //Act
            _builder.Build(_experience);

            //Assert
            _buildPackageCreator.Received().CreatePackageFromFolder(buildDirectory, buildPackageFileName);
        }

        [TestMethod]
        public void Build_ShouldUpdateExperienceBuildPath()
        {
            //Arrange
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            //Act
            _builder.Build(_experience);

            //Assert
            _experience.PackageUrl.Should().Be(buildId + ".zip");
            _experience.BuildOn.Should().Be(DateTimeWrapper.Now());
        }

        [TestMethod]
        public void Build_ShouldDeletePreviousBuildFiles()
        {
            //Arrange
            var downloadPath = "SomeDownloadPath";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetDownloadPath().Returns(downloadPath);

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().DeletePreviousFiles(downloadPath, buildId, _experience.Id.ToString("N"));
        }

        [TestMethod]
        public void Build_ShouldDeleteBuildDirectory()
        {
            //Arrange
            var buildDirectory = "SomeBuildDirectory";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());

            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().DeleteDirectory(buildDirectory);
        }

        [TestMethod]
        public void Build_ShouldReturnTrue()
        {
            //Arrange

            //Act
            var result = _builder.Build(_experience);

            //Assert
            result.Should().BeTrue();
        }

        #endregion

    }
}
