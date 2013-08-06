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
    public class PackageQuestionsListItem : ContainerElement<PackageObjectiveListLinkingModel>
    {
        public PackageQuestionsListItem(RemoteWebElement container)
            : base(container) { }

        public string Title
        {
            get
            {
                var title = GetByXPathInside(model.QuestionTitle);
                return title.GetTextContent();
            }
        }


    }
}
