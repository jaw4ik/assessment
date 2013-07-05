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
                var isAscEnabled = model.IsTitelSortingActive(GetByXPathInside(model.OrderAsc));
                var isDescEnabled = model.IsTitelSortingActive(GetByXPathInside(model.OrderDesc));
                if (isAscEnabled == isDescEnabled)
                    throw new InvalidOperationException("Both order buttons are in same state");
                return isAscEnabled ? Order.Ascending : Order.Descending;
            }
            set
            {
                var expectedOrder = value == Order.Ascending ? model.OrderAsc : model.OrderDesc;
                GetByXPathInside(expectedOrder).Click();
            }
        }

        internal void ClickBackToObjectives()
        {
            GetByXPath(model.BackToObjectives).Click();
        }
    }
}
