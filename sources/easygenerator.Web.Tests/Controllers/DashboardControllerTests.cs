using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class DashboardControllerTests
    {
        private DashboardController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _controller = new DashboardController();
        }

        #region Index

        [TestMethod]
        public void Index_ShouldReturnView()
        {
            //Act
            var result = _controller.Index();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        #endregion
    }
}

