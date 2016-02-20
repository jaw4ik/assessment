using System.Web.Http.Filters;
using easygenerator.PublicationServer.HttpResponseMessages;
using easygenerator.PublicationServer.Logging;

namespace easygenerator.PublicationServer.ActionFilters
{
    public class GeneralExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly HttpResponseMessageFactory _httpResponseMessageFactory;
        private readonly ILog _logger;

        public GeneralExceptionFilterAttribute(ILog logger, HttpResponseMessageFactory httpResponseMessageFactory)
        {
            _logger = logger;
            _httpResponseMessageFactory = httpResponseMessageFactory;
        }

        public override void OnException(HttpActionExecutedContext context)
        {
            _logger.LogException(context.Exception);
            context.Response = _httpResponseMessageFactory.InternalServerError();
        }
    }
}

