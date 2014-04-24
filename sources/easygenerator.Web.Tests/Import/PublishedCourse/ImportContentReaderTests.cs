using System.Web;
using easygenerator.Infrastructure;
using easygenerator.Web.Import.PublishedCourse;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Import.PublishedCourse
{
    [TestClass]
    public class ImportContentReaderTests
    {
        private ImportContentReader _importContentReader;
        private PhysicalFileManager _physicalFileManager;

        [TestInitialize]
        public void InitializeContext()
        {
            HttpContext.Current = new HttpContext(new HttpRequest(null, "http://tempuri.org", null), new HttpResponse(null));

            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _importContentReader = new ImportContentReader(_physicalFileManager);
        }

        #region ReadContent

        [TestMethod]
        public void ReadContent_ShouldReturnContentFromCache_WhenContentStoredThere()
        {
            //Arrange
            var filePath = "asddfhfdgjdgfsfghsfgh";
            var fileContent = "afdhfjdhdghsfghshsfghsfgh";

            HttpContext.Current.Cache.Insert("import:" + filePath, fileContent);

            //Act
            var content = _importContentReader.ReadContent(filePath);

            //Assert
            content.Should().Be(fileContent);
            _physicalFileManager.DidNotReceive().ReadAllFromFile(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadContent_ShouldReturnContentFromFileSystem_WhenContentNotFoundInCache()
        {
            //Arrange
            var filePath = "asddfhfdgjdgfsfghsfgh";
            var fileContent = "afdhfjdhdghsfghshsfghsfgh";

            HttpContext.Current.Cache.Remove("import:" + filePath);
            _physicalFileManager.ReadAllFromFile(filePath).Returns(fileContent);

            //Act
            var content = _importContentReader.ReadContent(filePath);

            //Assert
            content.Should().Be(fileContent);
            _physicalFileManager.Received().ReadAllFromFile(filePath);
        }

        [TestMethod]
        public void ReadContent_ShouldPutContentToCache_WhenContentReadFromFileSystem()
        {
            //Arrange
            var filePath = "asddfhfdgjdgfsfghsfgh";
            var fileContent = "afdhfjdhdghsfghshsfghsfgh";

            HttpContext.Current.Cache.Remove("import:" + filePath);
            _physicalFileManager.ReadAllFromFile(filePath).Returns(fileContent);

            //Act
            var content = _importContentReader.ReadContent(filePath);

            //Assert
            HttpContext.Current.Cache.Get("import:" + filePath).Should().Be(fileContent);
        }

        #endregion
    }
}
