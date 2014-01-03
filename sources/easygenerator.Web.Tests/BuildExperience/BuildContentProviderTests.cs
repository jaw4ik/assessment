using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.PackageModel;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class BuildContentProviderTests
    {
        private BuildContentProvider _buildContentProvider;

        private Experience _experience;
        private ExperiencePackageModel _experiencePackageModel;

        private BuildPathProvider _buildPathProvider;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _fileManager;
        private PackageModelSerializer _packageModelSerializer;
        private PackageModelMapper _packageModelMapper;

        [TestInitialize]
        public void InitializeContext()
        {
            _experience = GetExperienceToBuild();
            _experiencePackageModel = new PackageModelMapper().MapExperience(_experience);

            _fileManager = Substitute.For<PhysicalFileManager>();
            _packageModelSerializer = Substitute.For<PackageModelSerializer>();

            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns(string.Empty);

            _buildPathProvider = Substitute.For<BuildPathProvider>(_httpRuntimeWrapper);
            _packageModelMapper = Substitute.For<PackageModelMapper>();
            _packageModelMapper.MapExperience(_experience).Returns(_experiencePackageModel);

            _buildContentProvider = new BuildContentProvider(_fileManager, _buildPathProvider, _packageModelSerializer, _packageModelMapper);
        }

        #region AddBuildContentToPackageDirectory

            #region Add template directory

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldCopyTemplateToBuildDirectory()
            {
                //Arrange
                var buildDirectory = "SomeDirectoryPath";
                var templateDirectory = "SomeTemplatePath";
                //var buildId = GetBuildId();

                _buildPathProvider.GetTemplateDirectoryName(_experience.Template.Name).Returns(templateDirectory);
                _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _fileManager.Received().CopyDirectory(templateDirectory, buildDirectory);
            }

            #endregion

            #region Add experience content

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldDeleteContentDirectory()
            {
                //Arrange
                var contentDirectory = "SomeContentPath";
                _buildPathProvider.GetContentDirectoryName(Arg.Any<string>()).Returns(contentDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _fileManager.Received().DeleteDirectory(contentDirectory);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldCreateContentDirectory()
            {
                //Arrange
                var contentDirectory = "SomeContentPath";
                _buildPathProvider.GetContentDirectoryName(Arg.Any<string>()).Returns(contentDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _fileManager.Received().CreateDirectory(contentDirectory);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldCreateObjectiveDirectory()
            {
                //Arrange
                var objectiveDirectory = "SomeObjectivePath";
                _buildPathProvider.GetObjectiveDirectoryName(Arg.Any<string>(), _experience.RelatedObjectives.ToArray()[0].Id.ToNString()).Returns(objectiveDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _fileManager.Received().CreateDirectory(objectiveDirectory);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldCreateQuestionDirectory()
            {
                //Arrange
                var questionDirectory = "SomeQuestionPath";
                _buildPathProvider.GetQuestionDirectoryName(Arg.Any<string>(),
                    _experience.RelatedObjectives.ToArray()[0].Id.ToNString(),
                    _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                    .Returns(questionDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _fileManager.Received().CreateDirectory(questionDirectory);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteQuestionContentToFile_WhenQuestionContentIsDefined()
            {
                //Arrange
                var questionContentPath = "SomePath";
                _buildPathProvider.GetQuestionContentFileName(Arg.Any<string>(),
                    _experience.RelatedObjectives.ToArray()[0].Id.ToNString(),
                    _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                    .Returns(questionContentPath);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _fileManager.Received().WriteToFile(questionContentPath, _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Content);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldNotWriteQuestionContentToFile_WhenQuestionContentIsNull()
            {
                //Arrange
                _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].UpdateContent(null, "SomeUser");
                var questionContentPath = "SomePath";

                _buildPathProvider.GetQuestionContentFileName(Arg.Any<string>(),
                    _experience.RelatedObjectives.ToArray()[0].Id.ToNString(),
                    _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                    .Returns(questionContentPath);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _fileManager.DidNotReceive().WriteToFile(questionContentPath, _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Content);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteLearningContentsToFile()
            {
                //Arrange
                var learningContentsFilePath = "SomeELearningContentsPath";
                _buildPathProvider.GetLearningContentFileName(Arg.Any<string>(),
                    _experience.RelatedObjectives.ToArray()[0].Id.ToNString(),
                    _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToNString(),
                    _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0].Id.ToNString())
                    .Returns(learningContentsFilePath);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _fileManager.Received().WriteToFile(learningContentsFilePath, _experience.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0].Text);
            }

            #endregion

            #region Add experience data file

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteSerializedPackageModelToFile()
            {
                //Arrange
                var packageModelFilePath = "SomePackageModelPath";
                var serializedPackageModel = "SomePackageModelData";

                _buildPathProvider.GetDataFileName(Arg.Any<string>()).Returns(packageModelFilePath);
                _packageModelSerializer.Serialize(_experiencePackageModel).Returns(serializedPackageModel);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _packageModelSerializer.Received().Serialize(_experiencePackageModel);
                _fileManager.Received().WriteToFile(packageModelFilePath, serializedPackageModel);
            }

            #endregion

            #region Add template settings file

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteExperienceTemplateSettingsToFile()
            {
                //Arrange
                string settingsFileName = "settingsFileName";
                string settings = "settings";

                var experience = Substitute.For<Experience>();
                experience.Template.Returns(Substitute.For<Template>());
                experience.GetTemplateSettings(Arg.Any<Template>()).Returns(settings);

                _packageModelMapper.MapExperience(experience).Returns(_experiencePackageModel);
                _buildPathProvider.GetSettingsFileName(Arg.Any<string>()).Returns(settingsFileName);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), experience);

                //Assert
                _fileManager.Received().WriteToFile(settingsFileName, settings);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteEmptyExperienceTemplateSettingsToFile_WhenTemplateSettingsDoNotExist()
            {
                //Arrange
                const string settingsFileName = "settingsFileName";

                var experience = Substitute.For<Experience>();
                experience.Template.Returns(Substitute.For<Template>());
                experience.GetTemplateSettings(experience.Template).Returns((string)null);

                _packageModelMapper.MapExperience(experience).Returns(_experiencePackageModel);
                _buildPathProvider.GetSettingsFileName(Arg.Any<string>()).Returns(settingsFileName);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);

                //Assert
                _fileManager.Received().WriteToFile(settingsFileName, String.Empty);
            }

            #endregion

        #endregion

        #region Private methods

        private Experience GetExperienceToBuild()
        {
            var answer = AnswerObjectMother.Create("AnswerText", true);
            var explanation = LearningContentObjectMother.Create("Text");

            var question = QuestionObjectMother.Create("QuestionTitle");
            question.UpdateContent("Some question content", "SomeUser");
            question.AddAnswer(answer, "SomeUser");
            question.AddLearningContent(explanation, "SomeUser");

            var objective = ObjectiveObjectMother.Create("ObjectiveTitle");
            objective.AddQuestion(question, "SomeUser");

            var experience = ExperienceObjectMother.Create("ExperienceTitle");
            experience.UpdateTemplate(TemplateObjectMother.Create(name: "Default"), "SomeUser");
            experience.RelateObjective(objective, "SomeUser");

            return experience;
        }

        #endregion
    }
}
