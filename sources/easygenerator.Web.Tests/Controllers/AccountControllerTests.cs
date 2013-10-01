using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class AccountControllerTests
    {
        private AccountController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _controller = new AccountController();
        }
        
        #region PrivacyPolicy

        [TestMethod]
        public void PrivacyPolicy_ShouldReturnViewResult()
        {
            //Arrange

            
            //Act
            var result = _controller.PrivacyPolicy();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        #endregion

        #region TermsOfUse

        [TestMethod]
        public void TermsOfUse_ShouldReturnViewResult()
        {
            //Arrange


            //Act
            var result = _controller.TermsOfUse();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        #endregion

        #region SignUp

        [TestMethod]
        public void SignUp_ShouldReturnViewResult()
        {
            //Arrange


            //Act
            var result = _controller.SignUp();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        #endregion
    }
}
