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
    public class StorageTests
    {
        private Web.Storage.Storage _storage;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private ConfigurationReader _configurationReader;
        private PhysicalFileManager _physicalFileManager;
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
            _imageResizer = Substitute.For<IImageResizer>();

            _storage = new Web.Storage.Storage(_httpRuntimeWrapper, _configurationReader, _physicalFileManager,
                _imageResizer);
        }


        [TestMethod]
        public void GetCachedImagePath_Should_ReturnCorrectFilePath_WhenScaleBySmallerSideIsTrue()
        {
            var resultPath =
                Path.Combine(imagePath, "cache", "0", imageFilename, cachedImageFilenameWithSmallerSideScaling);

            _storage.GetCachedImagePath(imageFilename + imageFileExtension, width, height, true).Should().Be(resultPath);
        }

        [TestMethod]
        public void GetCachedImagePath_Should_ReturnCorrectFilePath_WhenScaleBySmallerSideIsFalse()
        {
            var resultPath =
                Path.Combine(imagePath, "cache", "0", imageFilename, cachedImageFilenameWithoutSmallerSideScaling);

            _storage.GetCachedImagePath(imageFilename + imageFileExtension, width, height, false).Should().Be(resultPath);
        }

        [TestMethod]
        public void GetCachedImagePath_ShouldNot_CallImageResizer_WhenCachedImageIsExists()
        {
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);


            var imageFilepath = Path.Combine(imagePath, "0", imageFilename);

            _storage.GetCachedImagePath(imageFilename + imageFileExtension, width, height, false);

            _imageResizer.DidNotReceive().ResizeImage(Arg.Any<string>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<bool>());
        }

        [TestMethod]
        public void GetCachedImagePath_Should_CallImageResizer_WhenCachedImageIsNotExists()
        {
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(false);

            var imageFilepath = Path.Combine(imagePath, "0", imageFilename + imageFileExtension);

            _storage.GetCachedImagePath(imageFilename + imageFileExtension, width, height, false);

            _imageResizer.Received().ResizeImage(imageFilepath, width, height, false);
        }

        [TestMethod]
        public void GetCachedImagePath_Should_CreateResizedImage_WhenCachedImageIsExists()
        {
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);

            var resultPath =
               Path.Combine(imagePath, "cache", "0", imageFilename, cachedImageFilenameWithoutSmallerSideScaling);


            _storage.GetCachedImagePath(imageFilename + imageFileExtension, width, height, false);

            _physicalFileManager.DidNotReceive().WriteToFile(resultPath, Arg.Any<byte[]>());
        }

        [TestMethod]
        public void GetCachedImagePath_Should_CreateResizedImage_WhenCachedImageIsNotExists()
        {
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(false);

            var resultPath =
               Path.Combine(imagePath, "cache", "0", imageFilename, cachedImageFilenameWithoutSmallerSideScaling);


            _storage.GetCachedImagePath(imageFilename + imageFileExtension, width, height, false);

            _physicalFileManager.Received().WriteToFile(resultPath, Arg.Any<byte[]>());
        }
    }
}

