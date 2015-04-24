using easygenerator.Infrastructure;
using System.Net;
using System.Web.Http.Filters;

namespace easygenerator.PublicationServer.ActionFilters
{
    public class GeneralExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly StaticViewContentProvider _contentProvider;
        private readonly ILog _logger;

        public GeneralExceptionFilterAttribute(StaticViewContentProvider contentProvider, ILog logger)
        {
            _contentProvider = contentProvider;
            _logger = logger;
        }

        public override void OnException(HttpActionExecutedContext context)
        {
            _logger.LogException(context.Exception);
            context.Response = new HtmlPageResponseMessage("500.html", _contentProvider,
                HttpStatusCode.InternalServerError);
        }
    }
}

