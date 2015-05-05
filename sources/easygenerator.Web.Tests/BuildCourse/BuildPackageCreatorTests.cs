using System;
using System.IO;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class BuildPackageCreatorTests
    {
        private PhysicalFileManager _physicalFileManager;
        private BuildPackageCreator _buildPackageCreator;
        private string packageFolderPath, destinationFileName;

        [TestInitialize]
        public void InitializeContext()
        {
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _buildPackageCreator = new BuildPackageCreator(_physicalFileManager);
            _physicalFileManager.DirectoryExists(Arg.Any<String>()).Returns(true);

            packageFolderPath = "some\\directory\\path";
            destinationFileName = "directory\\package.zip";
        }

        #region CreatePackageFromFolder

        [TestMethod]
        public void CreatePackageFromFolder_ShouldThrowArgumentException_WhenPackageFolderPathIsEmpty()
        {
            //Arrange
            packageFolderPath = string.Empty;

            //Act
            Action action = () => _buildPackageCreator.CreatePackageFromFolder(packageFolderPath, destinationFileName);

            //Assert
            action.ShouldThrow<ArgumentException>().And.Message.Should().Be("Source directory path is invalid");
        }

        [TestMethod]
        public void CreatePackageFromFolder_ShouldThrowDirectoryNotFoundException_WhenPackageFolderIsNotExist()
        {
            //Arrange
            _physicalFileManager.DirectoryExists(Arg.Any<String>()).Returns(false);

            //Act
            Action action = () => _buildPackageCreator.CreatePackageFromFolder(packageFolderPath, destinationFileName);

            //Assert
            action.ShouldThrow<DirectoryNotFoundException>().And.Message.Should().Be("Source directory not found");
        }

        [TestMethod]
        public void CreatePackageFromFolder_ShouldThrowArgumentException_WhenDestinationFileNameIsEmpty()
        {
            //Arrange
            destinationFileName = string.Empty;

            //Act
            Action action = () => _buildPackageCreator.CreatePackageFromFolder(packageFolderPath, destinationFileName);

            //Assert
            action.ShouldThrow<ArgumentException>().And.Message.Should().Be("Package file name is invalid");
        }

        #endregion

    }
}
