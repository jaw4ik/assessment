using System;
using System.Data.SqlClient;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components.Tasks
{
    public class PasswordRecoveryTicketExpirationTask : SqlCommandTask
    {
        public PasswordRecoveryTicketExpirationTask(ConfigurationReader configurationReader)
            : base(configurationReader)
        {
        }

        protected override string GetQueryString()
        {
            return "DELETE FROM dbo.PasswordRecoveryTickets " +
                   "WHERE CreatedOn < @ExpirationDate";
        }

        protected override SqlParameter[] GetParameters()
        {
            var expirationDate = DateTimeWrapper.Now().Subtract(new TimeSpan(0, 0, _configurationReader.PasswordRecoveryExpirationInterval, 0));
            
            return new[]
            {
                new SqlParameter("@ExpirationDate", expirationDate)
            };
        }
    }
}