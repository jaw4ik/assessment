using Elmah;
using System.Collections;
using System.Text;

namespace easygenerator.Web.Components.Elmah
{
    public class SqlErrorLogExtended : SqlErrorLog
    {
        public SqlErrorLogExtended(IDictionary config)
            : base(config)
        {
        }

        public SqlErrorLogExtended(string connectString)
            : base(connectString)
        {
        }

        public override string Log(Error error)
        {
            if (error.Exception.Data.Keys.Count > 0)
            {
                var stringBuilder = new StringBuilder();

                foreach (var key in error.Exception.Data.Keys)
                {
                    stringBuilder.Append(string.Format("{0}: {1}. ", key, error.Exception.Data[key]));
                }

                error.Detail = string.Concat(stringBuilder.ToString(), error.Detail);
            }

            return base.Log(error);
        }
    }
}