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
    public class CreatePage : BasePageElement<CreatePageLinkingModel>
    {
        public CreatePage() { }

        internal void ClearEditArea()
        {
            GetByXPath(model.TextBlockEditArea).Clear();
        }

        internal void AddNewTitleText(string Text)
        {
            GetByXPath(model.TextBlockEditArea).SendKeys(Text);
            System.Threading.Thread.Sleep(200);
        }

        public bool EditTitleTextBlockIsActive
        {
            get
            {
                return GetByXPath(model.EditTitleTextBlock).CssContains("active"); 
            } 
        }

        public string EditTitleTextBlockText
        {
            get
            {
                return GetByXPath(model.TextBlockEditArea).GetTextContent();
            }
        }



        public bool ButtonCreateAndEditIsEnabled
        {
            get
            {
                return !GetByXPath(model.ButtonCreateAndEdit).CssContains("disabled");
            }
        }

        public bool ButtonCreateAndNewIsEnabled
        {
            get
            {
                return !GetByXPath(model.ButtonCreateAndNew).CssContains("disabled");
            }
        }

        internal void BackButtonClick()
        {
            var link = GetByXPath(model.BackButton);
            link.Click();
        }

        public string MaxCharsCount
        {
            get
            {
                return GetByXPath(model.MaxCharsCount).GetTextContent();
            }
        }

        public string CharsCount
        {
            get
            {
                return GetByXPath(model.CharsCount).GetTextContent();
            }
        }

        public bool CharsCounterErrorIsShown
        {
            get
            {
                return GetByXPath(model.CharsCounter).CssContains("error");
            }
        }

        public bool TextBlockErrorIsShown
        {
            get
            {
                return GetByXPath(model.EditTitleTextBlock).CssContains("error");
            }
        }


        internal void CreateAndEditButtonClick()
        {
            var link = GetByXPath(model.ButtonCreateAndEdit);
            link.Click();
        }

        internal void CreateAndNewButtonClick()
        {
            var link = GetByXPath(model.ButtonCreateAndNew);
            link.Click();
        }
                
        internal void DefaultTemplateSelectorClick()
        {
            System.Threading.Thread.Sleep(200);
            //var link = GetByXPath(model.TemplateSelector);
            //link.Click();
            var defaultLink = GetByXPath(model.DefaultTemplateSelector);
            defaultLink.Click();
        }

        internal void QuizTemplateSelectorClick()
        {
            //var link = GetByXPath(model.TemplateSelector);
            //link.Click();
            var quizLink = GetByXPath(model.QuizTemplateSelector);
            quizLink.Click();
        }

    }
}
