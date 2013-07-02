using easygenerator.AcceptanceTests.LinkingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.ElementObjects
{


    public enum Order { Ascending, Descending }
    public class ObjectivesListPage : BasePageElement<ObjectiveListLinkingModel>
    {
        public ObjectivesListItem[] Items { get { throw new NotImplementedException(); } }

        public Order Order { get; set; }

        internal object GetColumnsCount()
        {
            throw new NotImplementedException();
        }
    }
}
