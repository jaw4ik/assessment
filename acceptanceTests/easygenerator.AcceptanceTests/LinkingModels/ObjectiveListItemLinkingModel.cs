using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ObjectiveListItemLinkingModel : BaseLinkinkModel
    {
        public string Title = ".//span[contains(@class,'alert')]";

        public string OpenElement = "";

        public string SelectElement = "";
    }
}
