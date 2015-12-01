using Autofac.Integration.WebApi;
using easygenerator.StorageServer.DataAccess;

namespace easygenerator.StorageServer.Attributes
{
    public class UnitOfWorkFilter : IAutofacActionFilter
    {
        private readonly IUnitOfWork _unitOfWork;

        public UnitOfWorkFilter(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public void OnActionExecuted(System.Web.Http.Filters.HttpActionExecutedContext actionExecutedContext)
        {
            _unitOfWork.Save();
        }

        public void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext) { }
    }
}