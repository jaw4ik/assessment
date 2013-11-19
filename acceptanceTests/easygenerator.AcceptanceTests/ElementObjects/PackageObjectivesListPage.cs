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
    public class PackageObjectivesListPage : BasePageElement<PackageObjectiveListLinkingModel>
    {
        public PackageObjectivesListPage() { }

        public PackageObjectivesListItem[] ObjectiveItems
        {
            get
            {
                var items = GetAllByXPath(model.ObjectiveItem);
                return items.Select(it => new PackageObjectivesListItem(it)).ToArray();
            }
        }


        public PackageObjectivesListItem ObjectiveItemByTitle(string title)
        {
            return ObjectiveItems.First(it => it.Title == title);
        }

        public PackageQuestionsListItem[] QuestionItems
        {
            get
            {
                var els = GetAllByXPath(model.QuestionItem);
                return els.Select(el => new PackageQuestionsListItem(el)).ToArray();
            }
        }

        public PackageQuestionsListItem[] ObjectiveQuestionItems(string title)
        {


            var obj = ObjectiveItemByTitle(title);
            var questions = obj.Container.FindElementsByXPath(model.QuestionItem).Cast<RemoteWebElement>().ToArray();

            return questions.Select(el => new PackageQuestionsListItem(el)).ToArray();

        }


        internal void ProgressSummaryButtonClick()
        {
            var btn = GetByXPath(model.ProgressSummaryButton);
            btn.Click();
        }

        internal void DoNotReportLinkClick()
        {
            var btn = GetByXPath(model.DoNotReportLink);
            btn.Click();
        }

        internal void PackageQuestionListItemClick(string questionTitle, string objectiveTitle)
        {

        }

    }
}
