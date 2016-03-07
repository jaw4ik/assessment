using System;
using System.IO;
using System.IO.Compression;

namespace easygenerator.PublicationServer.FileSystem
{
    public class PhysicalFileManager
    {
        public virtual void DeleteDirectory(string path)
        {
            if (String.IsNullOrEmpty(path))
                throw new ArgumentException();

            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }
        }

        public virtual void ExtractArchiveToDirectory(string archivePath, string destinationPath)
        {
            ZipFile.ExtractToDirectory(archivePath, destinationPath);
        }

        public virtual void DeleteFile(string path)
        {
            if (String.IsNullOrEmpty(path))
                throw new ArgumentException();

            if (File.Exists(path))
                File.Delete(path);
        }

        public virtual string ReadAllFromFile(string fileName)
        {
            if (File.Exists(fileName))
            {
                return File.ReadAllText(fileName);
            }

            throw new ArgumentException($"File {fileName} not found");
        }

        public virtual bool FileExists(string filePath)
        {
            return File.Exists(filePath);
        }
    }
}
