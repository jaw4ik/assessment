using System;

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
    }
}
