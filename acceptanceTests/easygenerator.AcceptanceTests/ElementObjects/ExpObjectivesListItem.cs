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
    public class ExpObjectivesListItem : ContainerElement<ExpObjectiveListItemLinkingModel>
    {

        public ExpObjectivesListItem(RemoteWebElement container)
            : base(container) { }

        public string Title
        {
            get
            {
                var el = GetByXPathInside(model.Title);
                return el.GetTextContent();
            }
        }

        public string QuestionCount
        {
            get
            {
                var el = GetByXPathInside(model.QuestionCountElement);
                return el.GetTextContent();
            }
        }


        internal void Select()
        {
            GetByXPathInside(model.SelectElement).Click();
        }

        public bool IsSelected
        {
            get
            {
                return Container.CssContains(model.IsSelectedClass);
            }
        }

        public bool IsEditEnabled
        {
            get
            {
                var editEl = GetByXPathInside(model.EditElement);
                return editEl.Displayed;
            }
        }
        public bool IsSelectedEnabled
        {
            get
            {
                var selectEl = GetByXPathInside(model.SelectElement);
                return selectEl.Displayed;
            }
        }


        internal void Open()
        {
            GetByXPathInside(model.EditElement).Click();
        }
    }
}
