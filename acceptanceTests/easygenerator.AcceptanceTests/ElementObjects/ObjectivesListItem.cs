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
    public class ObjectivesListItem : BasePageElement<ObjectiveListItemLinkingModel>
    {

        public ObjectivesListItem(RemoteWebElement container)
            : base(container) { }

        public string Title
        {
            get
            {
                var el = Container.FindElementByXPath(model.Title);
                return el.Text;
            }
        }

        internal void Click()
        {
            Container.Click();
        }

        internal bool IsVisisble()
        {
            var pageWidth = Container.WrappedDriver.ExecuteScript<Int64>("return document.documentElement.clientWidth");
            var pageHeight = Container.WrappedDriver.ExecuteScript<Int64>("return document.documentElement.clientHeight");
            var x1 = Container.Size.Width + Container.Coordinates.LocationInDom.X;
            var y1 = Container.Size.Height + Container.Coordinates.LocationInDom.Y;
            var scrollX = Container.WrappedDriver.ExecuteScript<Int64>("return window.scrollX");
            var scrollY = Container.WrappedDriver.ExecuteScript<Int64>("return window.scrollY");

            var isP1OnScreen = Container.Coordinates.LocationInDom.X > scrollX &&
                Container.Coordinates.LocationInDom.Y > scrollY;
            var isP2OnScreen = x1 > scrollX + pageWidth &&
                y1 > scrollY + pageHeight;

            return Container.Displayed && isP1OnScreen && isP2OnScreen;
        }

        internal void Hover()
        {
            Container.HoverElement();
        }

        public bool IsSelected
        {
            get
            {
                return model.IsSelected(Container);
            }
        }

        public bool IsOpenEnabled
        {
            get
            {
                var openEl = Container.FindElementByXPath(model.OpenElement);
                return openEl.Displayed;
            }
        }
    }
}
