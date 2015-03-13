using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Storage;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.DomainModel.Entities;
using System.IO;

namespace easygenerator.Web.Tests.Storage
{
    [TestClass]
    public class TemplateStorageTests
    {
        private TemplateStorage _templateStorage;
        private PhysicalFileManager _physicalFileManager;
        private ConfigurationReader _configurationReader;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private ILog _logger;

        private Template _template;
        private TemplateStorageConfigurationSection _templateStorageConfiguration;

        [TestInitialize]
        public void InitializeContext()
        {
            _template = Substitute.For<Template>("Some template", "username");

            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _logger = Substitute.For<ILog>();

            _templateStorageConfiguration = new TemplateStorageConfigurationSection()
            {
                TemplatesPath = "Templates",
                CustomTemplatesPath = "CustomTemplates"
            };
            _configurationReader.TempateStorageConfiguration.Returns(_templateStorageConfiguration);

            _templateStorage = new TemplateStorage(_configurationReader, _httpRuntimeWrapper, _physicalFileManager, _logger);
        }

        #region TemplateDirectoryExist

        [TestMethod]
        public void TemplateDirectoryExist_ShouldReturnTrue_WhenTemplateDirectoryExists()
        {
            //Arrange
            _physicalFileManager.DirectoryExists(Arg.Any<string>()).Returns(true);

            //Act
            var result = _templateStorage.TemplateDirectoryExist(_template);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void TemplateDirectoryExist_ShouldReturnFalse_WhenTemplateDirectoryDoesNotExist()
        {
            //Arrange
            _physicalFileManager.DirectoryExists(Arg.Any<string>()).Returns(false);

            //Act
            var result = _templateStorage.TemplateDirectoryExist(_template);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void TemplateDirectoryExist_ShouldLogException_WhenTemplateDirectoryDoesNotExist()
        {
            //Arrange
            _physicalFileManager.DirectoryExists(Arg.Any<string>()).Returns(false);

            //Act
            _templateStorage.TemplateDirectoryExist(_template);

            //Assert
            _logger.Received().LogException(Arg.Any<DirectoryNotFoundException>());
        }

        #endregion

        #region FileExists

        [TestMethod]
        public void FileExists_ShouldReturnTrue_WhenPhysicalFileExists()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);

            //Act
            var result = _templateStorage.FileExists(_template, "fileName");

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void FileExists_ShouldReturnFalse_WhenPhysicalFileDoesNotExist()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(false);

            //Act
            var result = _templateStorage.FileExists(_template, "fileName");

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void FileExists_ShouldLogException_WhenPhysicalFileDoesNotExist()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(false);

            //Act
            _templateStorage.FileExists(_template, "fileName");

            //Assert
            _logger.Received().LogException(Arg.Any<FileNotFoundException>());
        }

        #endregion

        #region GetAbsoluteFilePath

        [TestMethod]
        public void GetAbsoluteFilePath_ShouldReturnAbsoluteFilePath()
        {
            //Arrange
            var fileName = "fileName";

            //Act
            var result = _templateStorage.GetAbsoluteFilePath(_template, fileName);

            //Assert
            var expectedResult = Path.Combine(_templateStorageConfiguration.TemplatesPath, _template.Name, fileName);
            result.Should().Be(expectedResult);
        }

        #endregion

        #region GetTemplateDirectoryPath

        [TestMethod]
        public void GetTemplateDirectoryPath_ShouldReturnTemplateDirectoryPath_WhenTemplateIsNotCustomAndPathIsRooted()
        {
            //Arrange
            _templateStorageConfiguration.TemplatesPath = "D:\\Templates";
            _template.IsCustom.Returns(false);

            //Act
            var result = _templateStorage.GetTemplateDirectoryPath(_template);

            //Assert
            var expectedResult = Path.Combine(_templateStorageConfiguration.TemplatesPath, _template.Name);
            result.Should().Be(expectedResult);
        }

        [TestMethod]
        public void GetTemplateDirectoryPath_ShouldReturnRootedTemplateDirectoryPath_WhenTemplateIsNotCustomAndPathNotRooted()
        {
            //Arrange
            _templateStorageConfiguration.TemplatesPath = "Templates";
            _httpRuntimeWrapper.GetDomainAppPath().Returns("D:\\");
            _template.IsCustom.Returns(false);

            //Act
            var result = _templateStorage.GetTemplateDirectoryPath(_template);

            //Assert
            var expectedResult = Path.Combine("D:\\", _templateStorageConfiguration.TemplatesPath, _template.Name);
            result.Should().Be(expectedResult);
        }

        [TestMethod]
        public void GetTemplateDirectoryPath_ShouldReturnCustomTemplateDirectoryPath_WhenTemplateIsCustomAndPathIsRooted()
        {
            //Arrange
            _templateStorageConfiguration.CustomTemplatesPath = "D:\\CustomTemplates";
            _template.IsCustom.Returns(true);

            //Act
            var result = _templateStorage.GetTemplateDirectoryPath(_template);

            //Assert
            var expectedResult = Path.Combine(_templateStorageConfiguration.CustomTemplatesPath, _template.Name);
            result.Should().Be(expectedResult);
        }

        [TestMethod]
        public void GetTemplateDirectoryPath_ShouldReturnRootedCustomTemplateDirectoryPath_WhenTemplateIsCustomAndPathNotRooted()
        {
            //Arrange
            _templateStorageConfiguration.CustomTemplatesPath = "CustomTemplates";
            _httpRuntimeWrapper.GetDomainAppPath().Returns("D:\\");
            _template.IsCustom.Returns(true);

            //Act
            var result = _templateStorage.GetTemplateDirectoryPath(_template);

            //Assert
            var expectedResult = Path.Combine("D:\\", _templateStorageConfiguration.CustomTemplatesPath, _template.Name);
            result.Should().Be(expectedResult);
        }

        #endregion
    }
}
