using System;
using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;

namespace easygenerator.Web.Tests.Utils
{
    /// <summary>
    /// Extends ObjectAssertions methods to assert that a reference type object is in the expected state.
    /// 
    /// </summary>

    public static class CustomObjectAssertions
    {
        /// <summary>
        /// Asserts that the object is not of the specified type <typeparamref name="T"/>.
        /// 
        /// </summary>
        /// <typeparam name="T">The expected type of the object.</typeparam><param name="reason">A formatted phrase as is supported by <see cref="M:System.String.Format(System.String,System.Object[])"/> explaining why the assertion
        ///             is needed. If the phrase does not start with the word <i>because</i>, it is prepended automatically.
        ///             </param><param name="reasonArgs">Zero or more objects to format using the placeholders in <see cref="!:reason"/>.
        ///             </param>
        public static AndConstraint<ObjectAssertions> NotBeOfType<T>(this ObjectAssertions targetType, string reason = "", params object[] reasonArgs)
        {
            targetType.NotBeOfType(typeof(T), reason, reasonArgs);
            return new AndConstraint<ObjectAssertions>(targetType);
        }

        /// <summary>
        /// Asserts that the object is not of the specified type <paramref name="expectedType"/>.
        /// 
        /// </summary>
        /// <param name="expectedType">The type that the subject is supposed to be of.
        ///             </param><param name="reason">A formatted phrase as is supported by <see cref="M:System.String.Format(System.String,System.Object[])"/> explaining why the assertion
        ///             is needed. If the phrase does not start with the word <i>because</i>, it is prepended automatically.
        ///             </param><param name="reasonArgs">Zero or more objects to format using the placeholders in <see cref="!:reason"/>.
        ///             </param>
        public static AndConstraint<ObjectAssertions> NotBeOfType(this ObjectAssertions targetType, Type expectedType, string reason = "", params object[] reasonArgs)
        {
            if (targetType.Subject != null)
            {
                AssertionExtensions.Should(targetType.Subject.GetType()).NotBe(expectedType, reason, reasonArgs);
            }

            return new AndConstraint<ObjectAssertions>((ObjectAssertions)targetType);
        }
    }
}
