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
        static int waitLoops = 40;
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
