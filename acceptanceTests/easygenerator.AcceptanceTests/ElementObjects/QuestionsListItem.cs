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
                return title.GetTextContent();
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
                return Container.CssContains(model.HoverPartClass);
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

        internal bool IsVisible()
        {
            return Container.IsVisible();
        }

        public bool AddEnabled { get { return GetByXPathInside(model.AddButton).IsVisible(); } }
        public bool OpenEnabled { get { return GetByXPathInside(model.OpenButton).IsVisible(); } }

        public bool EditEnabled { get { return GetByXPathInside(model.EditButton).IsVisible(); } }

        internal void ClickEdit()
        {
            GetByXPathInside(model.EditButton).Click();
        }
    }
}
