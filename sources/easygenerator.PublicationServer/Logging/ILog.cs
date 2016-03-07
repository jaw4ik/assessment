using System;

namespace easygenerator.PublicationServer.Logging
{
    public interface ILog
    {
        void LogException(Exception e);
    }
}
