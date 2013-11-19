using System;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionResults;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;

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

    public static class ActionResultFluentAssertions
    {
        public static JsonResultAssertions BeJsonResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonResult)
                .FailWith("Expected \"JsonResult\", but got {0}", value.Subject.GetType().Name);

            return new JsonResultAssertions(value.Subject as JsonResult);
        }

        public static JsonSuccessResultAssertions BeJsonSuccessResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonSuccessResult)
                .FailWith("Expected \"JsonSuccessResult\", but got {0}", value.Subject.GetType().Name);

            return new JsonSuccessResultAssertions(value.Subject as JsonSuccessResult);
        }

        public static JsonErrorResultAssertions BeJsonErrorResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonErrorResult)
                .FailWith("Expected \"JsonErrorResult\", but got {0}", value.Subject.GetType().Name);

            return new JsonErrorResultAssertions(value.Subject as JsonErrorResult);
        }

        public static HttpNotFoundResultAssertions BeHttpNotFoundResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is HttpNotFoundResult)
                .FailWith("Expected \"HttpNotFoundResult\", but got {0}", value.Subject.GetType().Name);

            return new HttpNotFoundResultAssertions(value.Subject as HttpNotFoundResult);
        }
    }

}
