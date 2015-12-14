using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Elmah;

namespace easygenerator.StorageServer.Components.Elmah
{
    public class ElmahLog : ILog
    {
        public void LogException(Exception e)
        {
            if (HttpContext.Current != null && HttpContext.Current.ApplicationInstance != null)
            {
                ErrorSignal.FromCurrentContext().Raise(e);
            }
            else
            {
                ErrorLog.GetDefault(null).Log(new Error(e));
            }
        }
    }

    public interface ILog
    {
        void LogException(Exception e);
    }
}