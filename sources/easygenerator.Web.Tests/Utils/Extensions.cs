using NSubstitute;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Utils
{
    public static class Extensions
    {
        public static void AddRandomModelStateError(this Controller controller)
        {
            controller.ModelState.AddModelError("error", "I am a fake error!");
        }

        public static void SetRequestAjaxHeaders(this HttpRequestBase request)
        {
            request.Headers.Returns(new WebHeaderCollection()
            {
                {"X-Requested-With", "XMLHttpRequest"}
            });
        }

        public static void PutValueProvider(this ValueProviderFactoryCollection factories, IValueProvider valueProvider)
        {
            factories.Clear();
            factories.Add(new ValueProviderFactoryStub(valueProvider));
        }
    }

    public class ValueProviderFactoryStub : ValueProviderFactory
    {
        private readonly IValueProvider _valueProvider;

        public ValueProviderFactoryStub(IValueProvider valueProvider)
        {
            _valueProvider = valueProvider;
        }

        public override IValueProvider GetValueProvider(ControllerContext controllerContext)
        {
            return _valueProvider;
        }
    }
}
