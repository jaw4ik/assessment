using System;
using System.Web;
using Elmah;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.Elmah
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
}