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
    }
}
