using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class ReleaseNoteControllerTests
    {
        private IReleaseNoteFileReader _releaseNoteFileReader;
        private ReleaseNoteController _releaseNoteController;
        private HttpContextBase _context;

        [TestInitialize]
        public void InitializeController()
        {
            _releaseNoteFileReader = Substitute.For<IReleaseNoteFileReader>();

            _context = Substitute.For<HttpContextBase>();
            _releaseNoteController = new ReleaseNoteController(_releaseNoteFileReader);
            _releaseNoteController.ControllerContext = new ControllerContext(_context, new RouteData(), _releaseNoteController);
        }

        #region GetReleaseNote

        [TestMethod]
        public void GetReleaseNote_ShouldReturnReleaseNotes()
        {
            _releaseNoteFileReader.Read().Returns("notes");
            var result = _releaseNoteController.GetReleaseNote();
            result.Should().BeJsonSuccessResult().And.Data.Should().Be("notes");
        }

        #endregion
    }
}
