using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
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
    public class ApplicationControllerTests
    {
        private ApplicationController _controller;

        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new ApplicationController();
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Index

        [TestMethod]
        public void Index_ShouldReturnViewResult_WhenUserIsAuthenticated()
        {
            //Arrange
            _user.Identity.IsAuthenticated.Returns(true);

            //Act
            var result = _controller.Index();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }
        #endregion
    }
}
