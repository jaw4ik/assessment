using System;
using System.Activities.Statements;
using System.Globalization;
using System.IO;
using System.Web;
using System.Web.Mvc;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.Controllers;
using System.Web.Routing;
using System.Net.Mime;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class FileStorageControllerTests
    {
        FileStorageController _controller;
        private HttpPostedFileBase postedFile;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _physicalFileManager;

        private HttpContextBase _context;
        private HttpRequestBase _request;
        private HttpFileCollectionBase _fileCollection;

        private const string DomainAppPath = "SomePath";


        [TestInitialize]
        public void InitializeContext()
        {
            postedFile = Substitute.For<HttpPostedFileBase>();

            _fileCollection = Substitute.For<HttpFileCollectionBase>();
            _fileCollection.Count.Returns(1);
            _fileCollection.Get(0).Returns(postedFile);

            _request = Substitute.For<HttpRequestBase>();
            _request.Files.Returns(_fileCollection);
            _request.Url.Returns(new Uri("http://some_url.com/some/path"));

            _context = Substitute.For<HttpContextBase>();
            _context.Request.Returns(_request);

            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns(DomainAppPath);
            _physicalFileManager = Substitute.For<PhysicalFileManager>();

            _controller = new FileStorageController(_httpRuntimeWrapper, _physicalFileManager);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Upload

        [TestMethod]
        public void Upload_ShouldReturnJsonResult()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.tiff");
            postedFile.ContentLength.Returns(1024);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeOfType<TextJsonSuccessResult>();
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonErrorResult_WhenRequestIsNull()
        {
            //Arrange
            _context.Request.Returns((HttpRequestBase)null);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Input data is invalid");
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonErrorResult_WhenRequestFilesIsNull()
        {
            //Arrange
            _request.Files.Returns((HttpFileCollectionBase) null);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Input data is invalid");
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonErrorResult_WhenRequestFilesCollectionIsEmpty()
        {
            //Arrange
            _request.Files.Count.Returns(0);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Input data is invalid");
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonErrorResult_WhenFileContentLengthIsZero()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.tiff");
            postedFile.ContentLength.Returns(0);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("File data is empty");
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonErrorResult_WhenFileNameIsEmpty()
        {
            //Arrange
            postedFile.FileName.Returns(string.Empty);
            postedFile.ContentLength.Returns(1024);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("File data is empty");
        }

        [TestMethod]
        public void Upload_ShouldSaveFile()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.tiff");
            postedFile.ContentLength.Returns(1024);

            //Act
            _controller.Upload();

            //Assert
            postedFile.Received().SaveAs(Arg.Any<String>());
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonSuccessResult_WhenUploadingFileWithTiffExtension()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.tiff");
            postedFile.ContentLength.Returns(1024);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeOfType<TextJsonSuccessResult>();
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonSuccessResult_WhenUploadingFileWithTifExtension()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.tif");
            postedFile.ContentLength.Returns(1024);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeOfType<TextJsonSuccessResult>();
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonSuccessResult_WhenUploadingFileWithPngExtension()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.png");
            postedFile.ContentLength.Returns(1024);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeOfType<TextJsonSuccessResult>();
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonSuccessResult_WhenUploadingFileWithJpgExtension()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.jpg");
            postedFile.ContentLength.Returns(1024);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeOfType<TextJsonSuccessResult>();
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonSuccessResult_WhenUploadingFileWithJpegExtension()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.jpeg");
            postedFile.ContentLength.Returns(1024);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeOfType<TextJsonSuccessResult>();
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonSuccessResult_WhenUploadingFileWithGifExtension()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.gif");
            postedFile.ContentLength.Returns(1024);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeOfType<TextJsonSuccessResult>();
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonErrorResult_WhenUploadingFileBiggerThen10MB()
        {
            //Arrange
            postedFile.FileName.Returns("SomeImage.gif");
            postedFile.ContentLength.Returns((int)(FileStorageController.MaximumFileSize + 1));

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeJsonErrorResult().
                And.Message.Should().Be("File size too big");
        }

        [TestMethod]
        public void Upload_ShouldReturnErrorJsonResult_WhenUploadingFileWithNotListedExtension()
        {
            //Arrange
            postedFile.FileName.Returns("InvalidExtension.exe");
            postedFile.ContentLength.Returns(1024);

            //Act
            var result = _controller.Upload();

            //Assert
            result.Should().BeJsonErrorResult().
                And.Message.Should().Be("Forbidden file extension *.exe");
        }

        #endregion

        #region Get

        [TestMethod]
        public void Get_ShouldReturnHttpStatusCode404_WhenFileNotExists()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<String>()).Returns(false);

            //Act
            var result = _controller.Get("filename");

            //Assert
            result.Should()
                .BeOfType<HttpStatusCodeResult>()
                .And.Subject.As<HttpStatusCodeResult>()
                .StatusCode.Should().Be((int)System.Net.HttpStatusCode.NotFound);
        }

        [TestMethod]
        public void Get_ShouldReturnFilePathResult_WhenFileExist()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<String>()).Returns(true);
            _physicalFileManager.GetFileContentType(Arg.Any<String>()).Returns("image/png");

            //Act
            var result = _controller.Get("filename");

            //Assert
            result.Should().BeOfType<FilePathResult>();
        }

        #endregion

    }
}
