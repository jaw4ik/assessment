using System.Web;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Infrastructure.Tests
{
    [TestClass]
    public class FileCacheTests
    {
        private FileCache _fileCache;
        private PhysicalFileManager _physicalFileManager;

        [TestInitialize]
        public void InitializeContext()
        {
            HttpContext.Current = new HttpContext(new HttpRequest(null, "http://tempuri.org", null), new HttpResponse(null));

            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _fileCache = new FileCache(_physicalFileManager);
        }

        #region ReadFromCacheOrLoad

        [TestMethod]
        public void ReadFromCacheOrLoad_ShouldReadFileContentFromCache()
        {
            //Arrange
            var filePath = "test";
            var fileContent = "some content";

            HttpContext.Current.Cache.Remove(filePath);                
            _physicalFileManager.ReadAllFromFile(filePath).Returns(fileContent);

            //Act
            var result = _fileCache.ReadFromCacheOrLoad(filePath);

            //Assert
            result.Should().Be(fileContent);
            _physicalFileManager.Received().ReadAllFromFile(filePath);
        }

        [TestMethod]
        public void ReadFromCacheOrLoad_ShouldReturnFileContentFromCache_WhenItemAlreadyCached()
        {
            //Arrange
            var filePath = "test";
            var fileContent = "some content";

            HttpContext.Current.Cache[filePath] = fileContent;

            //Act
            var result = _fileCache.ReadFromCacheOrLoad(filePath);

            //Assert
            result.Should().Be(fileContent);
            _physicalFileManager.DidNotReceive().ReadAllFromFile(filePath);
        }

        [TestMethod]
        public void ReadFromCacheOrLoad_ShouldPutFileContentToCache_WhenItWasReadFromFileSystem()
        {
            //Arrange
            var filePath = "test";
            var fileContent = "some content";

            HttpContext.Current.Cache.Remove(filePath);
            _physicalFileManager.ReadAllFromFile(filePath).Returns(fileContent);

            //Act
            _fileCache.ReadFromCacheOrLoad(filePath);

            //Assert
            HttpContext.Current.Cache[filePath].Should().Be(fileContent);
        }

        #endregion
    }
}
