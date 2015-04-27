using System;

namespace easygenerator.Infrastructure
{
    public interface ILog
    {
        void LogException(Exception e);
    }
}
