using easygenerator.Infrastructure.ImageProcessors;
using FluentAssertions;
using ImageMagick;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Infrastructure.Tests.ImageProcessors
{
    [TestClass]
    public class MagickImageResizerConfiguratorTests
    {
        private PhysicalFileManager fileManager;
        private MagickImageResizerConfigurator configurator;
        private const string DefaultCacheDirectory = @"C:\Windows\Temp";
        private const string NewCacheDirectory = @"C:\";

        [TestInitialize]
        public void Initialize()
        {
            fileManager = Substitute.For<PhysicalFileManager>();
            MagickAnyCPU.CacheDirectory = DefaultCacheDirectory;
            configurator = new MagickImageResizerConfigurator(fileManager);
        }

        [TestMethod]
        public void Configure_ShouldNotUpdateCacheDirectory_IfCacheDirectoryIsNull()
        {
            configurator.Configure(null);
            MagickAnyCPU.CacheDirectory.Should().Be(DefaultCacheDirectory);
        }

        [TestMethod]
        public void Configure_ShouldNotUpdateCacheDirectory_IfCacheDirectoryIsEmpty()
        {
            configurator.Configure(string.Empty);
            MagickAnyCPU.CacheDirectory.Should().Be(DefaultCacheDirectory);
        }

        [TestMethod]
        public void Configure_ShouldCheckIfDirectoryExists()
        {
            configurator.Configure(NewCacheDirectory);
            fileManager.Received().DirectoryExists(NewCacheDirectory);
        }

        [TestMethod]
        public void Configure_ShouldCreateCacheDirectoryIfNotExists()
        {
            fileManager.DirectoryExists(NewCacheDirectory).Returns(false);
            configurator.Configure(NewCacheDirectory);
            fileManager.Received().CreateDirectory(NewCacheDirectory);
        }

        [TestMethod]
        public void Configure_ShouldUpdateCacheDirectory_IfNotEmpty()
        {
            configurator.Configure(NewCacheDirectory);
            MagickAnyCPU.CacheDirectory.Should().Be(NewCacheDirectory);
        }
    }
}
