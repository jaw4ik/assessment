using easygenerator.Infrastructure.ImageProcessors;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Infrastructure.Tests.ImageProcessors
{
    [TestClass]
    public class MagickImageResizerConfiguratorTests
    {
        private PhysicalFileManager fileManager;
        private MagickAnyCPUWrapper magickAnyCpuWrapper;

        private MagickImageResizerConfigurator configurator;
        private const string NewCacheDirectory = @"NewCacheDirectory";

        [TestInitialize]
        public void Initialize()
        {
            fileManager = Substitute.For<PhysicalFileManager>();
            magickAnyCpuWrapper = Substitute.For<MagickAnyCPUWrapper>();
            configurator = new MagickImageResizerConfigurator(fileManager, magickAnyCpuWrapper);
        }

        [TestMethod]
        public void Configure_ShouldNotUpdateCacheDirectory_IfCacheDirectoryIsNull()
        {
            configurator.Configure(null);
            magickAnyCpuWrapper.DidNotReceive().CacheDirectory = null;
        }

        [TestMethod]
        public void Configure_ShouldNotUpdateCacheDirectory_IfCacheDirectoryIsEmpty()
        {
            configurator.Configure(string.Empty);
            magickAnyCpuWrapper.DidNotReceive().CacheDirectory = string.Empty;
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
            fileManager.DirectoryExists(NewCacheDirectory).Returns(true);
            configurator.Configure(NewCacheDirectory);
            magickAnyCpuWrapper.Received().CacheDirectory = NewCacheDirectory;
        }
    }
}
