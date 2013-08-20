using easygenerator.AcceptanceTests.LinkingModels;
using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.AcceptanceTests.Helpers;
using OpenQA.Selenium.Remote;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class PackageObjectivesListItem : ContainerElement<PackageObjectiveListItemLinkingModel>
    {
        public PackageObjectivesListItem(RemoteWebElement container)
            : base(container) { }

        public string Title
        {
            get
            {
                var el = GetByXPathInside(model.Title);
                return el.GetTextContent();
            }
        }

        public PackageQuestionsListItem[] QuestionItems
        {
            get
            {
                var els = GetAllByXPath(model.QuestionItem);
                return els.Select(el => new PackageQuestionsListItem(el)).ToArray();
            }
        }

        public PackageQuestionsListItem QuestionItemByTitle(string title)
        {
            return QuestionItems.First(it => it.Title == title);
        }

        internal void ToggleExpandButtonClick()
        {
            GetByXPathInside(model.ToggleExpandButton).Click();
        }



    }
}
