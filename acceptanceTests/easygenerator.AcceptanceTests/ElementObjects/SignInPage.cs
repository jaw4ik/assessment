using easygenerator.AcceptanceTests.LinkingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.AcceptanceTests.Helpers;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class SignInPage : BasePageElement<SignInPageLinkingModel>
    {
        public SignInPage() { }

        internal void SignInSubmitButtonClick()
        {
            var btn = GetByXPath(model.SignInSubmitButton);
            btn.HoverElement();
            System.Threading.Thread.Sleep(500);
            btn.Click();
        }

        internal void InputEmail(string text)
        {
            var el = GetByXPath(model.EmailInputField);
            el.Click();
            el.SendKeys(text);
        }

        internal void InputPassword(string text)
        {
            var el = GetByXPath(model.PasswordInputField);
            el.Click();
            el.SendKeys(text);
        }

        internal static void SignInSubmitButtonHover()
        {
            throw new NotImplementedException();
        }
    }
}
