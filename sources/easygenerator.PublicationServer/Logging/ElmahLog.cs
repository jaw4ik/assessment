using System;
using Elmah;

namespace easygenerator.PublicationServer.Logging
{
    public class ElmahLog : ILog
    {
        public void LogException(Exception e)
        {
            var context = ErrorSignal.FromCurrentContext();
            if (context != null)
            {
                context.Raise(e);
            }
        }
    }
}
