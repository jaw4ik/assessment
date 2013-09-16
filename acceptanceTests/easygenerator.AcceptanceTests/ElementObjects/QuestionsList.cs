using easygenerator.AcceptanceTests.Helpers;
using easygenerator.AcceptanceTests.LinkingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class QuestionsList : BasePageElement<QuestionsListLinkingModel>
    {
        public QuestionsList() { }

        public QuestionsListItem[] Items
        {
            get
            {
                var els = GetAllByXPath(model.Item);
                return els.Select(el => new QuestionsListItem(el)).ToArray();
            }
        }

        public Order Order
        {

            get
            {
                var isAscEnabled = GetByXPath(model.OrderAsc).CssContains(model.IsTitelSortingActiveClass);
                var isDescEnabled = GetByXPath(model.OrderDesc).CssContains(model.IsTitelSortingActiveClass);
                if (isAscEnabled == isDescEnabled)
                    throw new InvalidOperationException("Both order buttons are in same state");
                return isAscEnabled ? Order.Ascending : Order.Descending;
            }
            set
            {
                var expectedOrder = value == Order.Ascending ? model.OrderAsc : model.OrderDesc;
                GetByXPath(expectedOrder).Click();
            }
        }

        internal void ClickBackToObjectives()
        {
            GetByXPath(model.ObjectivesTabLink).Click();
        }

        //QUD Question

        internal void ClickAddNewQuestionButton()
        {
            GetByXPath(model.AddNewQuestionButton).Click();
        }

        internal void DeleteButtonClick()
        {
            GetByXPath(model.DeleteButton).Click();
        }

        public bool DeleteButtonIsDisplayed
        {
            get
            {
                return ExistsOnPage(model.DeleteButton);
            }
        }

        //CUD Objective


        public string ObjectiveTitle
        {
            get
            {
                return GetByXPath(model.ObjectiveTitle).GetTextContent();
            }
        }

        public string BackToObjectivesListLinkText
        {
            get
            {
                return GetByXPath(model.BackToObjectivesListLink).GetTextContent();
            }
        }
                
        internal void EditObjectiveTitleText(string newObjectiveTitle)
        {
            var objectiveTitle = GetByXPath(model.ObjectiveTitle);
            objectiveTitle.Click();
            objectiveTitle.Clear();
            objectiveTitle.SendKeys(newObjectiveTitle);
        }
        
        internal void BackToObjectivesListLinkClick()
        {
            GetByXPath(model.BackToObjectivesListLink).Click();
        }
        
        internal void ClearObjectiveTitleText()
        {
            var objectiveTitle = GetByXPath(model.ObjectiveTitle);
            objectiveTitle.Click();
            objectiveTitle.Clear();
        }


        public bool HeaderTitleTextBlockErrorIsShown
        {
            get
            {
                return GetByXPath(model.ObjectiveTitle).CssContains("error");
            }
        }
        
        public bool CharsCounterErrorIsShown
        {
            get
            {
                return GetByXPath(model.CharsCounter).CssContains("error");
            }
        }


    }
}
