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
    public class ShellSteps
    {
        Shell Shell;
        public ShellSteps(Shell Shell)
        {
            this.Shell = Shell;
        }

        [When(@"mouse hover logo")]
        public void WhenMouseHoverLogo()
        {
            Shell.HoverLogo();
        }

        [When(@"click on objectives navigation menu item")]
        public void WhenClickOnObjectivesNavigationMenuItem()
        {
            Shell.NavObjectivesClick();
        }

        [When(@"click on experiences navigation menu item")]
        public void WhenClickOnExperiencesNavigationMenuItem()
        {
            Shell.NavExperiencesClick();
        }



    }
}
