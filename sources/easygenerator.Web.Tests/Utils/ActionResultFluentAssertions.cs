using easygenerator.Web.Components.ActionResults;
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

        public static JsonErrorResultAssertions BeJsonErrorResult(this ObjectAssertions value, string reason = "", params object[] reasonArgs)
        {
            Execute.Assertion
                .BecauseOf(reason, reasonArgs)
                .ForCondition(value.Subject is JsonErrorResult)
                .FailWith("Expected \"JsonErrorResult\", but got {0}", value.Subject.GetType().Name);

            return new JsonErrorResultAssertions(value.Subject as JsonErrorResult);
        }
    }

}
