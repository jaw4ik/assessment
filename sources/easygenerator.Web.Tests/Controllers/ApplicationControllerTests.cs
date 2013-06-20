using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class ApplicationControllerTests
    {
        private ApplicationController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _controller = new ApplicationController();
        }

        #region Index

        [TestMethod]
        public void Index_ShouldReturnViewResult()
        {
            //Arrange


            //Act
            var result = _controller.Index();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        #endregion
    }
}
