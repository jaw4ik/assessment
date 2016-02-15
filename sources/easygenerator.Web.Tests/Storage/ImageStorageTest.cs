using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.ImageProcessors;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Storage;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Storage
{
    [TestClass]
    public class ImageStorageTest
    {
        private ImageStorage _imageStorage;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private ConfigurationReader _configurationReader;
        private PhysicalFileManager _physicalFileManager;
        private IStorage _storage;
        private IImageResizer _imageResizer;

        private const string imageFilename = "00000000-0000-0000-0000-000000000000";
        private const string imageFileExtension = ".jpg";
        private const string imagePath = "D:\\\\";
        private const int width = 200;
        private const int height = 200;
        private const string cachedImageFilenameWithSmallerSideScaling = "00000000-0000-0000-0000-000000000000_200_200_s.jpg";
        private const string cachedImageFilenameWithoutSmallerSideScaling = "00000000-0000-0000-0000-000000000000_200_200_b.jpg";

        [TestInitialize]
        public void Initialize()
        {
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _configurationReader = Substitute.For<ConfigurationReader>();

            _configurationReader.FileStorageConfiguration.Returns(Substitute.For<FileStorageConfigurationSection>());
            _configurationReader.FileStorageConfiguration.Path.Returns(imagePath);



            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _storage = Substitute.For<IStorage>();
            _imageResizer = Substitute.For<IImageResizer>();
            _imageStorage = new ImageStorage(_httpRuntimeWrapper, _configurationReader, _physicalFileManager, _storage, _imageResizer);
        }


        [TestMethod]
        public void GetImagePath_Should_ReturnCorrectFilePath_WhenScaleBySmallerSideIsTrue()
        {
            var resultPath =
                Path.Combine(imagePath, "cache", "0", imageFilename, cachedImageFilenameWithSmallerSideScaling);

            _imageStorage.GetImagePath(imageFilename + imageFileExtension, width, height, true).Should().Be(resultPath);
        }

        [TestMethod]
        public void GetImagePath_Should_ReturnCorrectFilePath_WhenScaleBySmallerSideIsFalse()
        {
            var resultPath =
                Path.Combine(imagePath, "cache", "0", imageFilename, cachedImageFilenameWithoutSmallerSideScaling);

            _imageStorage.GetImagePath(imageFilename + imageFileExtension, width, height, false).Should().Be(resultPath);
        }

        [TestMethod]
        public void GetImagePath_ShouldNot_CallImageResizer_WhenCachedImageIsExists()
        {
            _storage.FileExists(Arg.Any<string>()).Returns(true);

            _imageStorage.GetImagePath(imageFilename + imageFileExtension, width, height, false);

            _imageResizer.DidNotReceive().ResizeImage(Arg.Any<string>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<bool>());
        }

        [TestMethod]
        public void GetImagePath_Should_CallImageResizer_WhenCachedImageIsNotExists()
        {
            var imageFilepath = Path.Combine(imagePath, "0", imageFilename + imageFileExtension);

            _storage.FileExists(Arg.Any<string>()).Returns(false);
            _storage.GetFilePath(Arg.Any<string>()).Returns(imageFilepath);

            _imageStorage.GetImagePath(imageFilename + imageFileExtension, width, height, false);

            _imageResizer.Received().ResizeImage(imageFilepath, width, height, false);
        }

        [TestMethod]
        public void GetImagePath_Should_CreateResizedImage_WhenCachedImageIsExists()
        {
            _storage.FileExists(Arg.Any<string>()).Returns(true);

            var resultPath =
               Path.Combine(imagePath, "cache", "0", imageFilename, cachedImageFilenameWithoutSmallerSideScaling);


            _imageStorage.GetImagePath(imageFilename + imageFileExtension, width, height, false);

            _physicalFileManager.DidNotReceive().WriteToFile(resultPath, Arg.Any<byte[]>());
        }

        [TestMethod]
        public void GetImagePath_Should_CreateResizedImage_WhenCachedImageIsNotExists()
        {
            _storage.FileExists(Arg.Any<string>()).Returns(false);

            var resultPath =
               Path.Combine(imagePath, "cache", "0", imageFilename, cachedImageFilenameWithoutSmallerSideScaling);


            _imageStorage.GetImagePath(imageFilename + imageFileExtension, width, height, false);

            _physicalFileManager.Received().WriteToFile(resultPath, Arg.Any<byte[]>());
        }

        [TestMethod]
        public void GetCachedImagePath_Should_ReturnCachedFileFolderPath()
        {
            var resultPath =
                Path.Combine(imagePath, "cache", "0", imageFilename);

            _imageStorage.GetCachedImagePath(imageFilename + imageFileExtension).Should().Be(resultPath);
        }
    }
}

