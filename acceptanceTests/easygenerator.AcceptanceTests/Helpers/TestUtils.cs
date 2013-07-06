using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public static class TestUtils
    {
        static int waitLoops = 20;
        static int timeout = 250;
        public static bool WaitForCondition(Func<bool> condition)
        {
            int loop = 0;
            while (loop < waitLoops)
            {
                if (condition())
                    return true;
                Thread.Sleep(timeout);
                loop++;
            }
            return false;
        }
        public static void Assert_IsTrue_WithWait(Func<bool> condition, string message)
        {
            Assert.IsTrue(WaitForCondition(condition), message);
        }
        public static void Assert_IsFalse_WithWait(Func<bool> condition, string message)
        {
            Assert.IsFalse(WaitForCondition(condition), message);
        }

        public static void Assert_IsTrue_WithWait(Func<bool> condition, string message, string[] messages)
        {
            Assert_IsTrue_WithWait(condition, GetFullMessageText(message, messages));
        }
        public static void Assert_IsFalse_WithWait(Func<bool> condition, string message, string[] messages)
        {
            Assert_IsFalse_WithWait(condition, GetFullMessageText(message, messages));
        }

        private static string GetFullMessageText(string message, string[] messages)
        {
            return String.Join("\r\n", message + "\r\n" + messages);
        }
        public static bool AreCollectionsEqual(string[] firstCol, string[] secondCol)
        {
            if (firstCol.Length != secondCol.Length)
                return false;
            for (int i = 0; i < firstCol.Length; i++)
            {
                if (!firstCol[i].Equals(secondCol[i]))
                    return false;
            }
            return true;
        }
    }
}
