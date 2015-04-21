using easygenerator.DomainModel.Events;
using FluentAssertions;
using FluentAssertions.Execution;
using NSubstitute;
using NSubstitute.Core;
using System;
using System.Reflection;

namespace easygenerator.Web.Tests.Utils
{
    public static class DynamicFluentAssertions
    {
        /// <summary>
        /// Asserts that an actual object looks and behaves as the expected one, so called duck typing.
        /// 
        /// </summary>
        /// <param name="actual">
        /// An actual object
        /// </param>
        /// <param name="expected">
        /// A dynamic object that describes the expected state and behavior
        /// </param>
        /// <returns/>
        public static object ShouldBeSimilar(this object actual, object expected)
        {
            foreach (PropertyInfo prop in expected.GetType().GetProperties())
            {
                var expectedValue = prop.GetValue(expected, null);
                if (!expectedValue.GetType().IsValueType && expectedValue.GetType() != typeof(String))
                {
                    throw new InvalidOperationException("Only value types or strings are supported");
                }

                var actualProperty = actual.GetType().GetProperty(prop.Name);

                Execute.Assertion
                    .ForCondition(actualProperty != null)
                    .FailWith("Actual object doest not have property {0}", prop.Name);

                var actualValue = actual.GetType().GetProperty(prop.Name).GetValue(actual);

                Execute.Assertion
                    .ForCondition(expectedValue.GetType() == actualValue.GetType())
                    .FailWith("The type of property {0} in the expected object does not match the type of property {0} in the actual object", prop.Name);

                Execute.Assertion
                    .ForCondition(expectedValue.Equals(actualValue))
                    .FailWith("Expected value {0} does not equal to the actual value {1}", expectedValue, actualValue);

            }

            return actual;
        }

        public static void ShouldPublishEvent<T>(this IDomainEventPublisher publisher)
        {
            publisher.ReceivedCalls().Should().Contain(call => IsEventCall<T>(call));
        }

        public static void ShouldPublishEvent<T>(this IDomainEventPublisher publisher, int callCount)
        {
            publisher.ReceivedCalls().Should().HaveCount(callCount);
            publisher.ReceivedCalls().Should().OnlyContain(call => IsEventCall<T>(call));
        }

        public static void ShouldNotPublishEvent<T>(this IDomainEventPublisher publisher)
        {
            publisher.ReceivedCalls().Should().NotContain(call => IsEventCall<T>(call));
        }

        private static bool IsEventCall<T>(ICall call)
        {
            return call.GetArguments().Length > 0 && call.GetArguments()[0] is T;
        }

        public static object ShouldQuackLike(this object actual, object expected)
        {
            return ShouldBeSimilar(actual, expected);
        }
    }
}
