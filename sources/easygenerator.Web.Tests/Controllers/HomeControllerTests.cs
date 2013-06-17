using System;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTests
    {
        [TestMethod]
        public void Index_ShouldReturnViewResult()
        {
            var controller = new HomeController();

            Assert.AreEqual(controller.Index().GetType(), typeof(ViewResult));
        }
    }
}
