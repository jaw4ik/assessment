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
    public class Shell : BasePageElement<ShellLinkingModel>
    {
        public Shell() { }



        internal void HoverLogo()
        {
            GetByXPath(model.Logo).HoverElement();
        }

        internal void NavObjectivesClick()
        {
            GetByXPath(model.NavObjectives).Click();
        }
    }
}

