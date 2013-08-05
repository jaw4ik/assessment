using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Infrastructure;

namespace easygenerator.Tests
{
    [TestClass]
    public class PhysicalFileManagerTests
    {
        private PhysicalFileManager _physicalFileManager;

        [TestInitialize]
        public void InitializeContext()
        {
            _physicalFileManager = new PhysicalFileManager();
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateDirectory_ShouldThrowArgumentException_WhenPathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.CreateDirectory(string.Empty);

            //Assert
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeleteDirectory_ShouldThrowArgumentException_WhenPathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.DeleteDirectory(string.Empty);

            //Assert
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CopyDirectory_ShouldThrowArgumentException_WhenSourcePathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.CopyDirectory(string.Empty, "asdadsasd");

            //Assert
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CopyDirectory_ShouldThrowArgumentException_WhenDestinationPathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.CopyDirectory("asasd", string.Empty);

            //Assert
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void WriteToFile_ShouldThrowArgumentException_WhenPathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.WriteToFile(string.Empty, "asdadsasd");

            //Assert
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void WriteToFile_ShouldThrowArgumentException_WhenContentIsNull()
        {
            //Arrange

            //Act
            _physicalFileManager.WriteToFile("asasd", null);

            //Assert
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void ArchiveDirectory_ShouldThrowArgumentException_WhenPathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.ArchiveDirectory(string.Empty, "asdadsasd");

            //Assert
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void ArchiveDirectory_ShouldThrowArgumentException_WhenDestinationIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.ArchiveDirectory("asasd", String.Empty);

            //Assert
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeleteFile_ShouldThrowArgumentException_WhenPathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.DeleteFile(String.Empty);

            //Assert
        }
    }
}
