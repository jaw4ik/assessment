using System;
using System.Data.SqlClient;
using easygenerator.PublicationServer.Configuration;

namespace easygenerator.PublicationServer.DataAccess
{
    public abstract class BaseRepository
    {
        protected ConfigurationReader ConfigurationReader { get; }
        protected BaseRepository(ConfigurationReader configurationReader)
        {
            ConfigurationReader = configurationReader;
        }

        protected T ExecuteDbAction<T>(Func<SqlConnection, T> action)
        {
            using (var connection = new SqlConnection(ConfigurationReader.ConnectionString))
            {
                connection.Open();
                return action(connection);
            }
        }

        protected void ExecuteDbAction<T>(Action<SqlConnection> action)
        {
            using (var connection = new SqlConnection(ConfigurationReader.ConnectionString))
            {
                connection.Open();
                action(connection);
            }
        }
    }
}
