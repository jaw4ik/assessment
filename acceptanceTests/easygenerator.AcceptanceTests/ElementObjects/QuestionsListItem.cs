using easygenerator.AcceptanceTests.LinkingModels;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.AcceptanceTests.Helpers;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class QuestionsListItem : BasePageElement<QuestionListItemLinkingModel>
    {
        public QuestionsListItem(RemoteWebElement container)
            : base(container) { }


        public string Title
        {
            get
            {
                var title = Container.FindElementByXPath(model.QuestionTitle);
                return title.Text;
            }
        }

        public void Hover()
        {
            Container.HoverElement();
        }

        public bool IsHighLited
        {
            get
            {

            }
        }

        internal void Click()
        {
            Container.Click();
        }

        public bool IsSelected { get; set; }
    }
}
