using System.Data.SqlClient;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components.Tasks
{
    public abstract class SqlCommandTask : ITask
    {
        protected readonly ConfigurationReader _configurationReader;

        protected SqlCommandTask(ConfigurationReader configurationReader)
        {
            _configurationReader = configurationReader;
        }

        public void Execute()
        {
            using (var connection = CreateConnection())
            {
                string queryString = GetQueryString();

                var command = CreateCommand(queryString, connection);
                command.Parameters.AddRange(GetParameters());

                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();
            }
        }

        protected abstract string GetQueryString();

        protected abstract SqlParameter[] GetParameters();

        private SqlCommand CreateCommand(string queryString, SqlConnection connection)
        {
            return new SqlCommand(queryString, connection);
        }

        private SqlConnection CreateConnection()
        {
            return new SqlConnection(_configurationReader.ConnectionString);
        }
    }
}