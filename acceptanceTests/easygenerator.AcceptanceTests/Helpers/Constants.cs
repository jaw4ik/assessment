using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public enum Order { Ascending, Descending }
    public enum Browser { Chrome, IE, FF }
    public static class Constants
    {
        public static Dictionary<string, Order> OrderWay = new Dictionary<string, Order>()
        {
            {"ascending", Order.Ascending},
            {"descending", Order.Descending}
        };
        public static string En = "En";
    }
    public abstract class UniqueData
    {
        static int currentId = 0;
        public UniqueData()
        {
            Id = currentId;
            currentId++;
        }
        public int Id { get; set; }
    }
}
