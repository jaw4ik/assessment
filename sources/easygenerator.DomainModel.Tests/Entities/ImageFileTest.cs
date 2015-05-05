using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class ImageFileTest
    {
        #region Constructor

        [TestMethod]
        public void ImageFile_SholudThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => ImageFileObjectMother.CreateWithTitle(null);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void ImageFile_SholudThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => ImageFileObjectMother.CreateWithTitle("");
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void ImageFile_ShouldThrowArgumentException_WhenTitleHasNotExtesion()
        {
            //Arrange

            //Act
            Action action = () => ImageFileObjectMother.CreateWithTitle("title");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void ImageFile_ShouldThrowArgumentException_WhenTitleHasNotImageExtesion()
        {
            //Arrange

            //Act
            Action action = () => ImageFileObjectMother.CreateWithTitle("title.exe");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void ImageFile_ShouldNotThrowArgumentException_WhenTitleHasGifExtension()
        {
            //Arrange
            
            //Act
            Action action = () => ImageFileObjectMother.CreateWithTitle("title.gif");

            //Assert
            action.ShouldNotThrow<ArgumentException>();
        }

        [TestMethod]
        public void ImageFile_ShouldNotThrowArgumentException_WhenTitleHasJpgExtension()
        {
            //Arrange

            //Act
            Action action = () => ImageFileObjectMother.CreateWithTitle("title.jpg");

            //Assert
            action.ShouldNotThrow<ArgumentException>();
        }

        [TestMethod]
        public void ImageFile_ShouldNotThrowArgumentException_WhenTitleHasJpegExtension()
        {
            //Arrange

            //Act
            Action action = () => ImageFileObjectMother.CreateWithTitle("title.jpeg");

            //Assert
            action.ShouldNotThrow<ArgumentException>();
        }

        [TestMethod]
        public void ImageFile_ShouldNotThrowArgumentException_WhenTitleHasPngExtension()
        {
            //Arrange

            //Act
            Action action = () => ImageFileObjectMother.CreateWithTitle("title.png");

            //Assert
            action.ShouldNotThrow<ArgumentException>();
        }

        [TestMethod]
        public void ImageFile_ShouldNotThrowArgumentException_WhenTitleHasImageExtensionInAnyCase()
        {
            //Arrange

            //Act
            Action action = () => ImageFileObjectMother.CreateWithTitle("title.JPEG");

            //Assert
            action.ShouldNotThrow<ArgumentException>();
        }

        [TestMethod]
        public void ImageFile_SholudThrowArgumentException_WhenTitleLengthMoreThan255Characters()
        {
            var title = new string('*', 252) + ".gif";
            Action action = () => ImageFileObjectMother.CreateWithTitle(title);
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void ImageFile_SholudThrowArgumentNullException_WhenCreatedByIsNull()
        {
            Action action = () => ImageFileObjectMother.CreateWithCreatedBy(null);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void ImageFile_SholudThrowArgumentException_WhenCreatedByIsEmpty()
        {
            Action action = () => ImageFileObjectMother.CreateWithCreatedBy("");
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void ImageFile_ShouldCreateImageFileInstance()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            var imageFile = ImageFileObjectMother.Create("title.png", "author");

            imageFile.Id.Should().NotBeEmpty();
            imageFile.Title.Should().Be("title.png");
            imageFile.CreatedBy.Should().Be("author");
            imageFile.CreatedOn.Should().Be(DateTime.MaxValue);
            imageFile.ModifiedBy.Should().Be("author");
            imageFile.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        #endregion

        #region FileName

        [TestMethod]
        public void FileName_ShouldReturnPhysicalFileNameBasedOnIdAndOriginalFileExtension()
        {
            //Arrange
            var imageFile = ImageFileObjectMother.CreateWithTitle("image.jpeg");

            //Act
            var imageFileName = imageFile.FileName;

            //Assert
            imageFileName.Should().Be(imageFile.Id + ".jpeg");
        }

        #endregion
    }
}
