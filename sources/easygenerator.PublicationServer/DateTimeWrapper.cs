using System;

namespace easygenerator.PublicationServer
{
    public static class DateTimeWrapper
    {
        public static Func<DateTime> Now = () => DateTime.UtcNow;
    }
}
