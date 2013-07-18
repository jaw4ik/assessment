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
    public class QuestionPage : BasePageElement<QuestionPageLinkingModel>
    {
        public QuestionPage() { }

        public AnswerItem[] AnswerItems
        {
            get
            {
                var items = GetAllByXPath(model.AnswerItem);
                return items.Select(it => new AnswerItem(it)).ToArray();
            }
        }

        public ExplanationItem[] ExplanationItems
        {
            get
            {
                var items = GetAllByXPath(model.ExplanationItem);
                return items.Select(it => new ExplanationItem(it)).ToArray();
            }
        }

    }

    public class AnswerItem : ContainerElement<QuestionPageLinkingModel>
    {

        public AnswerItem(RemoteWebElement container)
            : base(container) { }

        public string Text
        {
            get
            {
                var el = GetByXPathInside(model.AnswerItemText);
                return el.GetTextContent();
            }
        }

        public bool IsCorrect
        {
            get
            {
                var el = GetByXPathInside(model.CorrectItemClass);
                return el.Displayed;
            }
        }
    }

    public class ExplanationItem : ContainerElement<QuestionPageLinkingModel>
    {

        public ExplanationItem(RemoteWebElement container)
            : base(container) { }

        public string Explanation
        {
            get
            {
                var el = GetByXPathInside(model.ExplanationText);
                return el.GetTextContent();
            }
        }

    }


}
