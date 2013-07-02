using easygenerator.AcceptanceTests.LinkingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class ObjectivesListItem : BasePageElement<ObjectiveListItemLinkingModel>
    {
        public string Title { get; set; }

        internal void Click()
        {
            throw new NotImplementedException();
        }

        internal bool IsVisisble()
        {
            throw new NotImplementedException();
        }

        internal void Hover()
        {
            throw new NotImplementedException();
        }

        public bool IsSelected { get; set; }

        public object IsOpenEnabled { get; set; }

        public object IsSelectEnabled { get; set; }
    }
}
