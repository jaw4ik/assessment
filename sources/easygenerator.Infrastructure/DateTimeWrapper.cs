using System;
using System.Data.SqlTypes;

namespace easygenerator.Infrastructure
{
    public static class DateTimeWrapper
    {
        static DateTimeWrapper()
        {
            InstanceStartTime = DateTime.UtcNow;
        }

        public static Func<DateTime> Now = () => DateTime.UtcNow;
        public static DateTime InstanceStartTime { get; private set; }

        public static Func<DateTime> MinValue = () => SqlDateTime.MinValue.Value;
    }
}
