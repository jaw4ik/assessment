using System;

namespace easygenerator.Infrastructure
{
    public static class DateTimeWrapper
    {
        public static Func<DateTime> Now = () => DateTime.UtcNow;
    }
}
