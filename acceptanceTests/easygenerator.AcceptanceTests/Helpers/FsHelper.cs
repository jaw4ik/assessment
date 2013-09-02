using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public class FsHelper
    {
        public static string Read(string fileName)
        {
            var path = Path.Combine(Environment.CurrentDirectory, fileName);
            var lines = File.ReadAllLines(path);
            return String.Concat(lines);
        }
        public static void Write(string fileName, string data)
        {
            var path = Path.Combine(Environment.CurrentDirectory, fileName);
            File.WriteAllText(path, data);
        }

        public static void DirClean(System.IO.DirectoryInfo directory)
        {
            foreach (System.IO.FileInfo file in directory.GetFiles()) file.Delete();
            foreach (System.IO.DirectoryInfo subDirectory in directory.GetDirectories()) subDirectory.Delete(true);
        }
    }
}
