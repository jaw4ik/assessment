using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ObjectiveListLinkingModel : BaseLinkinkModel
    {
        public string HomePageIcon = "//a[@class='brand']";
        public string Item = "//div[@class='objective-brief-content']";
    }
}
