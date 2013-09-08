using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionResults;
using FluentAssertions.Equivalency;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;

namespace easygenerator.Web.Tests.Utils
{
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

    public static class ActionResultFluentAssertions
    {
        public static JsonSuccessResultAssertions BeJsonSuccessResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonSuccessResult)
                .FailWith("Expected \"JsonSuccessResult\", but got {0}", value.Subject.GetType().Name);

            return new JsonSuccessResultAssertions(value.Subject as JsonSuccessResult);
        }
    }

}
