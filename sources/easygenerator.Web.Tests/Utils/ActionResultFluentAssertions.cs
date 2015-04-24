using easygenerator.Web.Components.ActionResults;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using System.Net;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Utils
{
    public class JsonResultAssertions : ObjectAssertions
    {

        public JsonResultAssertions(JsonResult subject)
            : base(subject)
        {
        }

        public JsonResult And
        {
            get
            {
                return Subject as JsonResult;
            }
        }
    }

    public class ViewResultAssertions : ObjectAssertions
    {

        public ViewResultAssertions(ViewResult subject)
            : base(subject)
        {
        }

        public ViewResult And
        {
            get
            {
                return Subject as ViewResult;
            }
        }
    }

    public class ContentResultAssertions : ObjectAssertions
    {

        public ContentResultAssertions(ContentResult subject)
            : base(subject)
        {
        }

        public ContentResult And
        {
            get
            {
                return Subject as ContentResult;
            }
        }
    }

    public class JsonSuccessResultAssertions : ObjectAssertions
    {

        public JsonSuccessResultAssertions(JsonSuccessResult subject)
            : base(subject)
        {
        }

        public JsonSuccessResult And
        {
            get
            {
                return Subject as JsonSuccessResult;
            }
        }
    }

    public class JsonErrorResultAssertions : ObjectAssertions
    {

        public JsonErrorResultAssertions(JsonErrorResult subject)
            : base(subject)
        {
        }

        public JsonErrorResult And
        {
            get
            {
                return Subject as JsonErrorResult;
            }
        }
    }

    public class JsonSuccessDataResultAssertions : ObjectAssertions
    {

        public JsonSuccessDataResultAssertions(JsonDataResult subject)
            : base(subject)
        {
        }

        public JsonDataResult And
        {
            get
            {
                return Subject as JsonDataResult;
            }
        }
    }

    public class HttpNotFoundResultAssertions : ObjectAssertions
    {
        public HttpNotFoundResultAssertions(HttpNotFoundResult subject)
            : base(subject)
        {

        }

        public HttpNotFoundResult And
        {
            get
            {
                return Subject as HttpNotFoundResult;
            }
        }
    }

    public class BadRequestResultAssertions : ObjectAssertions
    {
        public BadRequestResultAssertions(BadRequestResult subject)
            : base(subject)
        {

        }

        public HttpStatusCodeResult And
        {
            get
            {
                return Subject as BadRequestResult;
            }
        }
    }

    public class UnprocessableEntityResultAssertions : ObjectAssertions
    {
        public UnprocessableEntityResultAssertions(HttpStatusCodeResult subject)
            : base(subject)
        {

        }

        public HttpStatusCodeResult And
        {
            get
            {
                return Subject as HttpStatusCodeResult;
            }
        }
    }

    public class FileResultAssertions : ObjectAssertions
    {
        public FileResultAssertions(FileResult subject)
            : base(subject)
        {
        }

        public FileResult And
        {
            get { return Subject as FileResult; }
        }
    }

    public class FilePathResultAssertions : ObjectAssertions
    {
        public FilePathResultAssertions(FilePathResult subject)
            : base(subject)
        {
        }

        public FilePathResult And
        {
            get { return Subject as FilePathResult; }
        }
    }

    public class HttpStatusCodeResultAssertions : ObjectAssertions
    {
        public HttpStatusCodeResultAssertions(HttpStatusCodeResult subject)
            : base(subject)
        {

        }

        public HttpStatusCodeResult And
        {
            get
            {
                return Subject as HttpStatusCodeResult;
            }
        }
    }

    public class SuccessResultAssertions : ObjectAssertions
    {
        public SuccessResultAssertions(HttpStatusCodeResult subject)
            : base(subject)
        {

        }

        public HttpStatusCodeResult And
        {
            get
            {
                return Subject as HttpStatusCodeResult;
            }
        }
    }

    public class ImageResultAssertions : ObjectAssertions
    {
        public ImageResultAssertions(ImageResult subject)
            : base(subject)
        {

        }

        public ImageResult And
        {
            get
            {
                return Subject as ImageResult;
            }
        }
    }

    public class RedirectResultAssertions : ObjectAssertions
    {
        public RedirectResultAssertions(RedirectResult subject)
            : base(subject)
        {

        }

        public RedirectResult And
        {
            get
            {
                return Subject as RedirectResult;
            }
        }
    }

    public class HttpStatusCodeWithMessageResultAssertions : ObjectAssertions
    {
        public HttpStatusCodeWithMessageResultAssertions(HttpStatusCodeWithMessageResult subject)
            : base(subject)
        {

        }

        public HttpStatusCodeWithMessageResult And
        {
            get
            {
                return Subject as HttpStatusCodeWithMessageResult;
            }
        }
    }

    public class EmptyResultAssertions : ObjectAssertions
    {
        public EmptyResultAssertions(EmptyResult subject)
            : base(subject)
        {

        }

        public EmptyResult And
        {
            get
            {
                return Subject as EmptyResult;
            }
        }
    }

    public static class ActionResultFluentAssertions
    {
        public static JsonResultAssertions BeJsonResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonResult)
                .FailWith("Expected \"JsonResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new JsonResultAssertions(value.Subject as JsonResult);
        }

        public static JsonResultAssertions BeJsonResultWithData(this ObjectAssertions value, object data = null, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonResult)
                .ForCondition(((JsonResult)value.Subject).Data == data)
                .FailWith("Expected \"JsonResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new JsonResultAssertions(value.Subject as JsonResult);
        }

        public static ContentResultAssertions BeContentResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is ContentResult)
                .FailWith("Expected \"ContentResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new ContentResultAssertions(value.Subject as ContentResult);
        }

        public static ContentResultAssertions BeContentResultWithValue(this ObjectAssertions value, string content = null, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is ContentResult)
                .ForCondition(((ContentResult)value.Subject).Content == content)
                .FailWith("Expected \"ContentResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new ContentResultAssertions(value.Subject as ContentResult);
        }

        public static ViewResultAssertions BeViewResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is ViewResult)
                .FailWith("Expected \"ViewResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new ViewResultAssertions(value.Subject as ViewResult);
        }

        public static EmptyResultAssertions BeEmptyResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is EmptyResult)
                .FailWith("Expected \"ViewResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new EmptyResultAssertions(value.Subject as EmptyResult);
        }

        public static JsonSuccessResultAssertions BeJsonSuccessResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonSuccessResult)
                .FailWith("Expected \"JsonSuccessResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new JsonSuccessResultAssertions(value.Subject as JsonSuccessResult);
        }

        public static JsonErrorResultAssertions BeJsonErrorResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonErrorResult)
                .FailWith("Expected \"JsonErrorResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new JsonErrorResultAssertions(value.Subject as JsonErrorResult);
        }

        public static JsonErrorResultAssertions BeJsonErrorResultWithMessage(this ObjectAssertions value, string message, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonErrorResult)
                .ForCondition(((JsonErrorResult)value.Subject).Message == message)
                .FailWith("Expected \"JsonErrorResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new JsonErrorResultAssertions(value.Subject as JsonErrorResult);
        }

        public static JsonSuccessDataResultAssertions BeJsonDataResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonDataResult)
                .FailWith("Expected \"JsonDataResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new JsonSuccessDataResultAssertions(value.Subject as JsonDataResult);
        }


        public static HttpNotFoundResultAssertions BeHttpNotFoundResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is HttpNotFoundResult)
                .FailWith("Expected \"HttpNotFoundResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new HttpNotFoundResultAssertions(value.Subject as HttpNotFoundResult);
        }

        public static BadRequestResultAssertions BeBadRequestResult(this ObjectAssertions value, string description = "", string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is BadRequestResult)
                .FailWith("Expected \"BadRequestResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new BadRequestResultAssertions(value.Subject as BadRequestResult);
        }

        public static SuccessResultAssertions BeSuccessResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is HttpStatusCodeResult)
                .ForCondition(((HttpStatusCodeResult)value.Subject).StatusCode == (int)HttpStatusCode.OK)
                .FailWith("Expected \"SuccessResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new SuccessResultAssertions(value.Subject as HttpStatusCodeResult);
        }

        public static BadRequestResultAssertions BeBadRequestResultWithMessage(this ObjectAssertions value, string message = "", string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is BadRequestResult)
                .ForCondition(((BadRequestResult)value.Subject).Message == message)
                .FailWith("Expected \"BadRequestResult\" with message {0}, but got {1}", message, GetSubjectTypeErrorMessage(value.Subject));

            return new BadRequestResultAssertions(value.Subject as BadRequestResult);
        }

        public static FileResultAssertions BeFileResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is FileResult)
                .FailWith("Expected \"FilePathResult\", but got {0}", value.Subject.GetType().Name);

            return new FileResultAssertions(value.Subject as FileResult);
        }

        public static FilePathResultAssertions BeFilePathResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is FilePathResult)
                .FailWith("Expected \"FilePathResult\", but got {0}", value.Subject.GetType().Name);

            return new FilePathResultAssertions(value.Subject as FilePathResult);
        }

        public static HttpStatusCodeResultAssertions BeForbiddenResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is HttpStatusCodeResult)
                 .ForCondition(((HttpStatusCodeResult)value.Subject).StatusCode == (int)HttpStatusCode.Forbidden)
                .FailWith("Expected \"HttpStatusCodeResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new HttpStatusCodeResultAssertions(value.Subject as HttpStatusCodeResult);
        }

        public static HttpStatusCodeResultAssertions BeHttpStatusCodeResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is HttpStatusCodeResult)
                .FailWith("Expected \"HttpStatusCodeResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new HttpStatusCodeResultAssertions(value.Subject as HttpStatusCodeResult);
        }

        public static HttpStatusCodeResultAssertions BeHttpStatusCodeResultWithStatus(this ObjectAssertions value, int status, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is HttpStatusCodeResult)
                .ForCondition(((HttpStatusCodeResult)value.Subject).StatusCode == status)
                .FailWith("Expected \"HttpStatusCodeResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new HttpStatusCodeResultAssertions(value.Subject as HttpStatusCodeResult);
        }

        public static HttpStatusCodeWithMessageResultAssertions BeHttpStatusCodeResultWithMessage(this ObjectAssertions value, string message, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is HttpStatusCodeResult)
                .ForCondition(((HttpStatusCodeWithMessageResult)value.Subject).Message == message)
                .FailWith("Expected \"HttpStatusCodeResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new HttpStatusCodeWithMessageResultAssertions(value.Subject as HttpStatusCodeWithMessageResult);
        }

        public static ImageResultAssertions BeImageResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is ImageResult)
                .FailWith("Expected \"ImageResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new ImageResultAssertions(value.Subject as ImageResult);
        }

        public static RedirectResultAssertions BeRedirectResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is RedirectResult)
                .FailWith("Expected \"RedirectResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new RedirectResultAssertions(value.Subject as RedirectResult);
        }

        public static RedirectResultAssertions BeRedirectResultWithUrl(this ObjectAssertions value, string url = null, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is RedirectResult)
                  .ForCondition(((RedirectResult)value.Subject).Url == url)
                .FailWith("Expected \"RedirectResult\", but got {0}", GetSubjectTypeErrorMessage(value.Subject));

            return new RedirectResultAssertions(value.Subject as RedirectResult);
        }

        private static string GetSubjectTypeErrorMessage(object subject)
        {
            return subject == null ? null : subject.GetType().Name;
        }
    }

}
