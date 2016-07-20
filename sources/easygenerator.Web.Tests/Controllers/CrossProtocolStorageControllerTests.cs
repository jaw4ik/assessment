using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class CrossProtocolStorageControllerTests
    {
        private CrossProtocolStorageController _controller;
        
        private HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _context = Substitute.For<HttpContextBase>();
            _controller = new CrossProtocolStorageController();
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Index
        [TestMethod]
        public void Index_ShouldReturnViewResult()
        {
            //Act
            var result = _controller.Index();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }
        #endregion
    }
}
