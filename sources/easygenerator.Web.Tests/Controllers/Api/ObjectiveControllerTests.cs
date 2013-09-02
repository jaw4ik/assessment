using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.ViewModels.Objective;
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
        public void Create_ShouldReturnJsonSuccessResult()
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
