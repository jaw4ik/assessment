using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Newsletter.MailChimp.Entities
{
    public class MailChimpLists
    {
        public int Total { get; set; }
        public List<MailChimpList> Data { get; set; }
    }
}