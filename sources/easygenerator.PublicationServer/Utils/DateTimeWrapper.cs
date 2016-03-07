using System;

namespace easygenerator.PublicationServer.Utils
{
    public static class DateTimeWrapper
    {
        public static Func<DateTime> Now = () => DateTime.UtcNow;
    }
}
