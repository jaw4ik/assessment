using easygenerator.AcceptanceTests.LinkingModels;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class QuestionsListItem : BasePageElement<QuestionListItemLinkingModel>
    {
        public QuestionsListItem(RemoteWebElement container)
            : base(container) { }


        public string Title { get; set; }
    }
}
