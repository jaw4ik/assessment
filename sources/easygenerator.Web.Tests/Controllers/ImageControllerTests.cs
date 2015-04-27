using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Mime;
using System.Security.Policy;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Controllers;
using easygenerator.Web.Storage;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class ImageControllerTests
    {
        private ImageController _controller;

        private IEntityFactory _entityFactory;
        private IStorage _storage;
        private IImageStorage _imageStorage;
        private IImageFileRepository _repository;
        private IUrlHelperWrapper _urlHelperWrapper;
        private IFileTypeChecker _fileTypeChecker;
        private ILog _elmahLog;

        private IPrincipal _user;
        private HttpContextBase _context;


        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _storage = Substitute.For<IStorage>();
            _imageStorage = Substitute.For<IImageStorage>();
            _repository = Substitute.For<IImageFileRepository>();
            _urlHelperWrapper = Substitute.For<IUrlHelperWrapper>();
            _fileTypeChecker = Substitute.For<IFileTypeChecker>();
            _elmahLog = Substitute.For<ILog>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();

            _context.User.Returns(_user);


            _controller = new ImageController(_entityFactory, _storage, _imageStorage, _repository, _urlHelperWrapper, _fileTypeChecker, _elmahLog);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Get

        [TestMethod]
        public void Get_ShouldReturnBadRequest_WhenFileNameIsNull()
        {
            //Arrange


            //Act
            var result = _controller.Get(null, null, null, null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void Get_ShouldReturnHttpNotFound_WhenImageDoesNotExist()
        {
            //Arrange
            _storage.FileExists(Arg.Any<string>()).Returns(false);

            //Act
            var result = _controller.Get(String.Empty, null, null, null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void Get_ShouldReturnImageResult_WhenImageExists()
        {
            //Arrange
            const string path = "path";
            const int width = 100;
            const int height = 100;
            const bool scaleBySmallerSide = false;
            _storage.FileExists(Arg.Any<string>()).Returns(true);
            _storage.GetFilePath(Arg.Any<string>()).Returns(path);

            //Act
            var result = _controller.Get(String.Empty, width, height, scaleBySmallerSide);

            //Assert
            result.Should().BeImageResult();
        }


        #endregion

        #region GetCurrentUserImageCollection

        [TestMethod]
        public void GetCurrentUserImageCollection_ShouldReturnJsonSuccessWithCurrentUserImages()
        {
            //Arrange
            const string username = "username@easygenerator.com";
            var images = new[]
            {
                ImageFileObjectMother.CreateWithCreatedBy(username),
                ImageFileObjectMother.CreateWithCreatedBy(username)
            };
            _repository.GetCollection(Arg.Any<Expression<Func<ImageFile, bool>>>()).Returns(images);

            //Act
            var result = _controller.GetCurrentUserImageCollection();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.As<IEnumerable<object>>().Should().HaveCount(2);
        }

        #endregion

        #region Upload

        [TestMethod]
        public void Upload_ShouldReturnBadRequest_WhenInputFileIsNull()
        {
            //Arrange


            //Act
            var result = _controller.Upload(Substitute.For<HttpPostedFileBase>());

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void Upload_ShouldReturnBadRequest_WhenInputFileNameIsNull()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns((string)null);

            //Act
            var result = _controller.Upload(file);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void Upload_ShouldReturnBadRequest_WhenInputFileNameIsEmpty()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns(String.Empty);

            //Act
            var result = _controller.Upload(file);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void Upload_ShouldReturnBadRequest_WhenFileContentIsEmpty()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.ContentLength.Returns(0);

            //Act
            var result = _controller.Upload(file);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void Upload_ShouldReturnBadRequest_WhenFileIsNotAnImage()
        {
            //Arrange
            ArrangeImageValidator(false);
            ArrangeCurrentUser();
            ArrangeStorageMaxFileSize();

            //Act
            var result = _controller.Upload(FileSubstitute());

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void Upload_ShouldReturnRequestEntityTooLargeHttpStatusCode_WhenFileIsTooLarge()
        {
            //Arrange
            ArrangeImageValidator();
            ArrangeStorageMaxFileSize(1);

            //Act
            var result = _controller.Upload(FileSubstitute(contentLength: 2));

            //Assert
            result.Should().BeHttpStatusCodeResult().And.StatusCode.Should().Be(413);
        }

        [TestMethod]
        public void Upload_ShouldAddFileToRepository()
        {
            //Arrange
            ArrangeImageValidator();
            ArrangeCurrentUser();
            ArrangeStorageMaxFileSize();

            var image = Substitute.For<ImageFile>();
            _entityFactory.ImageFile(Arg.Any<string>(), Arg.Any<string>()).Returns(image);

            //Act
            _controller.Upload(FileSubstitute());

            //Assert
            _repository.Received().Add(image);
        }

        [TestMethod]
        public void Upload_ShouldTrimFileName_WhenFileNameContainsFullPath() // IE
        {
            //Arrange
            const string fileName = "fileName.txt";
            const string filePath = "C:\\" + fileName;

            ArrangeImageValidator();
            ArrangeCurrentUser();
            ArrangeStorageMaxFileSize();

            _entityFactory.ImageFile(Arg.Any<string>(), Arg.Any<string>()).Returns(Substitute.For<ImageFile>());

            //Act
            _controller.Upload(FileSubstitute(filePath));

            //Assert
            _entityFactory.Received().ImageFile(fileName, Arg.Any<string>());
        }

        [TestMethod]
        public void Upload_ShouldSaveFileOnDisk()
        {
            //Arrange
            ArrangeImageValidator();
            ArrangeCurrentUser();
            ArrangeStorageMaxFileSize();
            ArrangeImageFileEntityFactory();

            var file = FileSubstitute();

            const string path = "path";
            _storage.MapFilePath(Arg.Any<string>()).Returns(path);

            //Act
            _controller.Upload(file);

            //Assert
            file.Received().SaveAs(path);
        }

        [TestMethod]
        public void Upload_ShouldReturnJsonSuccess_WithUrl()
        {
            //Arrange
            ArrangeImageValidator();
            ArrangeCurrentUser();
            ArrangeStorageMaxFileSize();
            ArrangeImageFileEntityFactory();

            const string url = "url";
            _urlHelperWrapper.RouteImageUrl(Arg.Any<string>()).Returns(url);


            //Act
            var result = _controller.Upload(FileSubstitute());

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldQuackLike(new { url = url });
        }

        private void ArrangeImageValidator(bool isImage = true)
        {
            _fileTypeChecker.IsImage(Arg.Any<Stream>()).Returns(isImage);
        }

        private void ArrangeStorageMaxFileSize(long maxFileSize = 100)
        {
            _storage.GetMaxFileSize().Returns(maxFileSize);
        }

        private void ArrangeCurrentUser(string username = "username@easygenerator.com")
        {
            _user.Identity.Name.Returns(username);
        }

        private void ArrangeImageFileEntityFactory(ImageFile image = null)
        {
            _entityFactory.ImageFile(Arg.Any<string>(), Arg.Any<string>()).Returns(image ?? Substitute.For<ImageFile>());
        }
        
        private static HttpPostedFileBase FileSubstitute(string fileName = "fileName", int contentLength = 1)
        {
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns(fileName);
            file.ContentLength.Returns(contentLength);
            return file;
        }

        #endregion

    }
}
