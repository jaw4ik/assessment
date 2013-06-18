using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Tests
{
    public static class AssertException
    {
        public static void ExpectException<T>(Action action) where T : Exception
        {
            ExpectException<T>(action, false);
        }

        public static void ExpectInvalidOperationException(Action action)
        {
            ExpectException<InvalidOperationException>(action);
        }

        public static void ExpectArgumentException(Action action, string paramName)
        {
            try
            {
                ExpectException<ArgumentException>(action, true);
            }
            catch (ArgumentException e)
            {
                Assert.AreEqual(paramName, e.ParamName);
            }
        }

        public static void ExpectArgumentNullException(Action action, string paramName)
        {
            try
            {
                ExpectException<ArgumentNullException>(action, true);
            }
            catch (ArgumentNullException e)
            {
                Assert.AreEqual(paramName, e.ParamName);
            }
        }

        private static void ExpectException<T>(Action action, bool rethrow = false) where T : Exception
        {
            try
            {
                action();
            }
            catch (T)
            {
                if (rethrow)
                    throw;

                return;
            }
            catch { }

            Assert.Fail("The exception of type '{0}' was expected.", typeof(T).Name);
        }
    }
}
