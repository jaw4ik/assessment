using System.Data.SqlClient;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components.Tasks
{
    public class AccessTypeExpirationTask : SqlCommandTask
    {
        public AccessTypeExpirationTask(ConfigurationReader configurationReader)
            : base(configurationReader)
        {
        }

        protected override string GetQueryString()
        {
            return "UPDATE dbo.Users " +
                   "SET AccessType = 0, " +
                   "ExpirationDate = NULL " +
                   "WHERE ExpirationDate < @ExpirationDate";
        }

        protected override SqlParameter[] GetParameters()
        {
            return new[]
            {
                new SqlParameter("@ExpirationDate", DateTimeWrapper.Now())
            };
        }
    }
}