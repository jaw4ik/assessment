using System;
using System.Web.Mvc;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class ObjectiveControllerTests
    {
        private ObjectiveController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _controller = new ObjectiveController();
        }


        #region Create objective


        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResultWithObjectiveId()
        {
            //Arrange

            //Act
            var result = _controller.Create();

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);

        }

        #endregion

    }
}
