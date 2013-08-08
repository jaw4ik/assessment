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
    public class QuestionsListItem : ContainerElement<QuestionListItemLinkingModel>
    {
        public QuestionsListItem(RemoteWebElement container)
            : base(container) { }


        public string Title
        {
            get
            {
                var title = GetByXPathInside(model.QuestionTitle);
                return title.GetAttribute("value");
            }
        }

        internal void Click()
        {
            Container.Click();
        }

        public bool IsSelected
        {
            get
            {
                return Container.CssContains(model.SelectedPartClass);
            }
        }


        public bool SelectEnabled { get { return GetByXPathInside(model.SelectElement).IsVisible(); } }
        public bool OpenEnabled { get { return GetByXPathInside(model.OpenButton).IsVisible(); } }

        //public bool EditEnabled { get { return GetByXPathInside(model.EditButton).IsVisible(); } }

        //internal void ClickEdit()
        //{
        //    GetByXPathInside(model.EditButton).Click();
        //}

        internal void ClickOpen()
        {
            GetByXPathInside(model.OpenButton).Click();
        }

        internal void ClickSelect()
        {
            GetByXPathInside(model.SelectElement).Click();
        }
    }
}
