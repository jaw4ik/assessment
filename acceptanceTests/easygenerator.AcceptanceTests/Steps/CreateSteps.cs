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
                "incorrect CreateAndEdit and CreateAndNew status");
        }

        [Then(@"button CreateAndEdit is enabled (.*) on create view")]
        public void ThenButtonCreateAndEditIsEnabledFalseOnCreateView(bool isEnabled)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                (createPage.ButtonCreateAndEditIsEnabled == isEnabled),
                "incorrect CreateAndEdit status");
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

        [When(@"click back button on create view")]
        public void WhenClickBackButtonOnCreateView()
        {
            createPage.BackButtonClick();
        }

        [Then(@"max chars count '(.*)' is shown in chars counter on create view")]
        public void ThenMaxCharsCountIsShownInCharsCounterOnCreateView(string maxCharsCount)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                createPage.MaxCharsCount == maxCharsCount,
                "incorrect max chars count");
        }

        [Then(@"chars count '(.*)' is shown in chars counter on create view")]
        public void ThenCharsCountIsShownInCharsCounterOnCreateView(string charsCount)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                createPage.CharsCount == charsCount,
                "incorrect chars count");
        }

        [Then(@"title text block marked with error on create view")]
        public void ThenTitleTextBlockMarkedWithErrorOnCreateView()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                createPage.TextBlockErrorIsShown == true,
                "title text block is not marked with error");
        }

        [Then(@"chars counter marked with error on create view")]
        public void ThenCharsCounterMarkedWithErrorOnCreateView()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                createPage.CharsCounterErrorIsShown == true,
                "chars counter is not marked with error");
        }

        [When(@"click on create and edit button on create view")]
        public void WhenClickOnCreateAndEditButtonOnCreateView()
        {
            createPage.CreateAndEditButtonClick();
        }

        [When(@"click on create and new button on create view")]
        public void WhenClickOnCreateAndNewButtonOnCreateView()
        {
            createPage.CreateAndNewButtonClick();
        }

        //CUD Experience

        [When(@"choose default template on create experience view")]
        public void WhenChooseDefaultTemplateOnCreateExperienceView()
        {
            createPage.DefaultTemplateSelectorClick();
        }


    }
}
