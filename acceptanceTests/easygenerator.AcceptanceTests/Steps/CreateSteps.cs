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
    public class CreateSteps
    {
        CreatePage createPage;
        public CreateSteps(CreatePage createPage)
        {
            this.createPage = createPage;
        }

        [Then(@"edit title text block is active on create view")]
        public void ThenEditTitleTextBlockIsActiveOnCreateView()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                createPage.EditTitleTextBlockIsActive == true,
                "edit title text block is not active");
        }

        [Then(@"edit title text block is empty on create view")]
        public void ThenEditTitleTextBlockIsEmptyOnCreateView()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                createPage.EditTitleTextBlockText == "",
                "edit title text block is not empty");
        }

        [Then(@"buttons CreateAndEdit and CreateAndNew are enabled (.*) on create view")]
        public void ThenButtonsCreateAndEditAndCreateAndNewAreEnabledOnCreateView(bool isEnabled)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                (createPage.ButtonCreateAndEditIsEnabled == isEnabled) && (createPage.ButtonCreateAndNewIsEnabled == isEnabled),
                "edit title text block is not active");
        }

        [When(@"input '(.*)' into title edit area on create view")]
        public void WhenInputIntoTitleEditAreaOnCreateView(string text)
        {
            createPage.AddNewTitleText(text);
        }

        [When(@"clear edit area on create view")]
        public void WhenClearEditAreaOnCreateView()
        {
            createPage.ClearEditArea();
        }

    }
}
