using System;
using System.IO;

namespace easygenerator.Infrastructure
{
    public class PhysicalFileManager
    {
        public virtual void CreateDirectory(string path)
        {
            if (String.IsNullOrEmpty(path))
                throw new ArgumentException();

            Directory.CreateDirectory(path);
        }

        public virtual void DeleteDirectory(string path)
        {
            if (String.IsNullOrEmpty(path))
                throw new ArgumentException();

            Directory.Delete(path, true);
        }

        public virtual void CopyDirectory(string source, string destination)
        {
            if (String.IsNullOrEmpty(source))
                throw new ArgumentException();

            if (String.IsNullOrEmpty(destination))
                throw new ArgumentException();

            CopyDirectory(source, destination, true);
        }

        private void CopyDirectory(string sourceDirName, string destDirName, bool copySubDirs)
        {
            // Get the subdirectories for the specified directory.
            DirectoryInfo dir = new DirectoryInfo(sourceDirName);
            DirectoryInfo[] dirs = dir.GetDirectories();

            if (!dir.Exists)
            {
                throw new DirectoryNotFoundException(
                    "Source directory does not exist or could not be found: "
                    + sourceDirName);
            }

            // If the destination directory doesn't exist, create it. 
            if (!Directory.Exists(destDirName))
            {
                Directory.CreateDirectory(destDirName);
            }

            // Get the files in the directory and copy them to the new location.
            FileInfo[] files = dir.GetFiles();
            foreach (FileInfo file in files)
            {
                string temppath = Path.Combine(destDirName, file.Name);
                file.CopyTo(temppath, false);
            }

            // If copying subdirectories, copy them and their contents to new location. 
            if (copySubDirs)
            {
                foreach (DirectoryInfo subdir in dirs)
                {
                    string temppath = Path.Combine(destDirName, subdir.Name);
                    CopyDirectory(subdir.FullName, temppath, copySubDirs);
                }
            }
        }

        public virtual void WriteToFile(string path, string content)
        {
            if (content == null)
                throw new ArgumentException();

            File.WriteAllText(path, content);
        }

        public virtual void DeleteFile(string path)
        {
            if (String.IsNullOrEmpty(path))
                throw new ArgumentException();

            if (File.Exists(path))
                File.Delete(path);
        }

        public virtual void DeletePreviousFiles(string packagePath, string lastFileName, string pattern)
        {
            var filesNames = Array.FindAll(Directory.GetFiles(packagePath, pattern + "*.zip"),
                                            filename => filename != packagePath + "\\" + lastFileName + ".zip");

            if (filesNames.Length == 0)
                return;

            foreach (var filesName in filesNames)
            {
                try
                {
                    DeleteFile(filesName);
                }
                catch (UnauthorizedAccessException e)
                {
                    
                }
            }
        }
    }
}