using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Web.WooCommerce
{
    public interface IWooCommerceApiService
    {
        void RegisterUser(User user, string userPassword);
    }
}
