using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Infrastructure.Tests
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

        #region CreateDirectory

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateDirectory_ShouldThrowArgumentException_WhenPathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.CreateDirectory(string.Empty);

            //Assert
        }

        #endregion

        #region DeleteDirectory

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeleteDirectory_ShouldThrowArgumentException_WhenPathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.DeleteDirectory(string.Empty);

            //Assert
        }

        #endregion

        #region CopyDirectory

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

        #endregion

        #region WriteToFile

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
            _physicalFileManager.WriteToFile("asasd", null as String);

            //Assert
        }

        #endregion

        #region DeleteFile

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeleteFile_ShouldThrowArgumentException_WhenPathIsEmpty()
        {
            //Arrange

            //Act
            _physicalFileManager.DeleteFile(String.Empty);

            //Assert
        }


        #endregion
      
    }
}
