using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Web.Newsletter
{
    public interface INewsletterSubscriptionManager
    {
        bool SubscribeForNewsletters(string userEmail, string firstname, string lastname);
    }
}
