using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Extensions
{
    public static class GuidExtensions
    {
        public static string ToNString(this Guid value)
        {
            return value.ToString("N");
        }
    }
}