using easygenerator.AcceptanceTests.ElementObjects;
using easygenerator.AcceptanceTests.Helpers;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace easygenerator.AcceptanceTests.Steps
{
    [Binding]
    public class SignInPageSteps
    {
        SignInPage SignInPage;
        public SignInPageSteps(SignInPage SignInPage)
        {
            this.SignInPage = SignInPage;
        }

        [When(@"sign in as '(.*)' user on sign in page")]
        public void WhenSignInAsUserOnSignInPage(string userName)
        {
            if (userName == "test")
            {
                SignInPage.InputEmail(@"vr.danylchuk@ism-ukraine.com");
                SignInPage.InputPassword(@"Easy123!");                
                SignInPage.SignInSubmitButtonClick();
                System.Threading.Thread.Sleep(2000);
            }
            else
            {
                throw new NotImplementedException();
            }
        }


    }
}
