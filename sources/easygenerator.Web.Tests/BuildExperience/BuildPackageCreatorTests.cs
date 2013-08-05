using System;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class BuildPackageCreatorTests
    {
        private Mock<PhysicalFileManager> _physicalFileManagerMock;
        private BuildPackageCreator _buildPackageCreator;

        [TestInitialize]
        public void InitializeContext()
        {
            _physicalFileManagerMock = new Mock<PhysicalFileManager>();
            _buildPackageCreator = new BuildPackageCreator(_physicalFileManagerMock.Object);
        }

        #region CreatePackageFromFolder

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreatePackageFromFolder_ShouldThrowArgumentException_WhenPackageFolderPathIsEmpty()
        {
            //Arrange
            var packageFolderPath = string.Empty;
            var destinationFileName = "Some destination file";

            //Act
            _buildPackageCreator.CreatePackageFromFolder(packageFolderPath, destinationFileName);

            //Assert
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreatePackageFromFolder_ShouldThrowArgumentException_WhenDestinationFileNameIsEmpty()
        {
            //Arrange
            var packageFolderPath = "Some package folder path";
            var destinationFileName = string.Empty;

            //Act
            _buildPackageCreator.CreatePackageFromFolder(packageFolderPath, destinationFileName);

            //Assert
        }

        #endregion

    }
}
