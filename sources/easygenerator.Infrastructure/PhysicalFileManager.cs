using System;
using System.IO;
using System.IO.Compression;

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

            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }
        }

        public virtual void CopyFile(string source, string destination)
        {
            if (String.IsNullOrEmpty(source))
                throw new ArgumentException();

            if (String.IsNullOrEmpty(destination))
                throw new ArgumentException();

            File.Copy(source, destination);
        }

        public virtual void CopyFileToDirectory(string source, string destination)
        {
            if (String.IsNullOrEmpty(source))
                throw new ArgumentException();

            if (String.IsNullOrEmpty(destination))
                throw new ArgumentException();

            File.Copy(source, Path.Combine(destination, Path.GetFileName(source)));
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

        public virtual void WriteToFile(string path, byte[] content)
        {
            if (content == null)
                throw new ArgumentException();

            File.WriteAllBytes(path, content);
        }

        public virtual string ReadAllFromFile(string fileName)
        {
            if (FileExists(fileName))
            {
                return File.ReadAllText(fileName);
            }

            throw new ArgumentException(String.Format("File {0} not found", fileName));
        }

        public virtual void DeleteFile(string path)
        {
            if (String.IsNullOrEmpty(path))
                throw new ArgumentException();

            if (File.Exists(path))
                File.Delete(path);
        }

        public virtual void DeleteFilesInDirectory(string directoryPath, string deleteFilePattern, string deleteFileException)
        {
            var fileNamesToDelete = Array.FindAll(Directory.GetFiles(directoryPath, deleteFilePattern),
                                           filename => Path.Combine(directoryPath, deleteFileException) != filename);

            if (fileNamesToDelete.Length == 0)
                return;

            foreach (var filesName in fileNamesToDelete)
            {
                try
                {
                    DeleteFile(filesName);
                }
                catch (UnauthorizedAccessException)
                {

                }
            }
        }

        public virtual bool FileExists(string filePath)
        {
            return File.Exists(filePath);
        }

        public virtual byte[] GetFileBytes(string filePath)
        {
            return File.ReadAllBytes(filePath);
        }

        public virtual void ExtractArchiveToDirectory(string archivePath, string destinationPath)
        {
            ZipFile.ExtractToDirectory(archivePath, destinationPath);
        }

        public virtual string[] GetAllFilesInDirectory(string directoryPath)
        {
            return Directory.GetFiles(directoryPath, "*", SearchOption.AllDirectories);
        }

        public virtual string GetRelativePath(string file, string directory)
        {
            var pathUri = new Uri(file);
            if (!directory.EndsWith(Path.DirectorySeparatorChar.ToString()))
            {
                directory += Path.DirectorySeparatorChar;
            }

            var directoryUri = new Uri(directory);
            return Uri.UnescapeDataString(directoryUri.MakeRelativeUri(pathUri).ToString().Replace('/', Path.DirectorySeparatorChar));
        }

        public virtual bool DirectoryExists(string directoryPath)
        {
            return Directory.Exists(directoryPath);
        }
    }
}