using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public enum Order { Ascending, Descending }
    public static class GherkinConstants
    {


        public static Dictionary<string, Order> OrderWay = new Dictionary<string, Order>()
        {
            {"ascending", Order.Ascending},
            {"descending", Order.Descending}
        };
    }
}
