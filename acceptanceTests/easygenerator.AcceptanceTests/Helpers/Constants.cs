using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public enum Localization { En, Nl, De }
    public enum Order { Ascending, Descending }
    public enum Browser { Chrome, IE, FF }
    public static class Constants
    {
        public static Dictionary<string, Order> OrderWay = new Dictionary<string, Order>()
        {
            {"ascending", Order.Ascending},
            {"descending", Order.Descending}
        };
        public static Dictionary<string, Localization> localizations = new Dictionary<string, Localization>()
        {
            {"Nl",Localization.Nl},
            {"En",Localization.En},
            {"De",Localization.De}
        };
    }
}
