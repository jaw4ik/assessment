using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Utils
{
    public static class Extensions
    {
        public static void AddRandomModelStateError(this Controller controller)
        {
            controller.ModelState.AddModelError("error", "I am a fake error!");
        }
    }
}
