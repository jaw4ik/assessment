namespace easygenerator.Web.WooCommerce
{
    public interface IWooCommerceApiService
    {
        void RegisterUser(string userEmail, string firstname, string lastname, string userPassword, string country = null, string phone = null);
        void UpdateUser(string userEmail, string firstname, string lastname, string userPassword, string country = null, string phone = null);
    }
}
