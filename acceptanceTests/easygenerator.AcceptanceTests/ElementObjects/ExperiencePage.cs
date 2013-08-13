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
    public class ExperiencePage : BasePageElement<ExperiencePageLinkingModel>
    {
        public ExperiencePage() { }

        public ExpObjectivesListItem[] ObjectiveItems
        {
            get
            {
                var items = GetAllByXPath(model.Item);
                return items.Select(it => new ExpObjectivesListItem(it)).ToArray();
            }
        }

        public ExpObjectivesListItem ItemByTitle(string title)
        {
            return ObjectiveItems.First(it => it.Title == title);
        }

    }
}
