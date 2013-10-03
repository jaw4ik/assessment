using System;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class BuildPackageCreatorTests
    {
        private PhysicalFileManager _physicalFileManager;
        private BuildPackageCreator _buildPackageCreator;

        [TestInitialize]
        public void InitializeContext()
        {
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _buildPackageCreator = new BuildPackageCreator(_physicalFileManager);
        }

        #region CreatePackageFromFolder

        [TestMethod]
        public void CreatePackageFromFolder_ShouldThrowArgumentException_WhenPackageFolderPathIsEmpty()
        {
            //Arrange
            var packageFolderPath = string.Empty;
            var destinationFileName = "Some destination file";

            //Act
            Action action = () => _buildPackageCreator.CreatePackageFromFolder(packageFolderPath, destinationFileName);

            //Assert
            action.ShouldThrow<ArgumentException>();
        }

        [TestMethod]
        public void CreatePackageFromFolder_ShouldThrowArgumentException_WhenDestinationFileNameIsEmpty()
        {
            //Arrange
            var packageFolderPath = "Some package folder path";
            var destinationFileName = string.Empty;

            //Act
            Action action = () => _buildPackageCreator.CreatePackageFromFolder(packageFolderPath, destinationFileName);

            //Assert
            action.ShouldThrow<ArgumentException>();
        }

        #endregion

    }
}
