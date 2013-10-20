using System;
using System.Web;
using Elmah;

namespace easygenerator.Web.Components
{
    public class ElmahLog
    {
        public static void LogException(Exception e)
        {
            if (HttpContext.Current != null)
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