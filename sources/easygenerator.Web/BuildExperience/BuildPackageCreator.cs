using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text;
using easygenerator.Infrastructure;

namespace easygenerator.Web.BuildExperience
{
    public class BuildPackageCreator
    {
        private PhysicalFileManager _fileManager;

        public BuildPackageCreator(PhysicalFileManager fileManager)
        {
            _fileManager = fileManager;
        }

        public virtual void CreatePackageFromFolder(string packageFolderPath, string destinationFileName)
        {
            _fileManager.DeleteFile(destinationFileName);
            DoCreateFromDirectory(packageFolderPath, destinationFileName);
        }

        private void DoCreateFromDirectory(string sourceDirectoryName, string destinationArchiveFileName)
        {
            sourceDirectoryName = Path.GetFullPath(sourceDirectoryName);
            destinationArchiveFileName = Path.GetFullPath(destinationArchiveFileName);
            using (ZipArchive archive = ZipFile.Open(destinationArchiveFileName, ZipArchiveMode.Create))
            {
                DirectoryInfo info = new DirectoryInfo(sourceDirectoryName);
                string fullName = info.FullName;

                foreach (FileSystemInfo info2 in info.EnumerateFileSystemInfos("*", SearchOption.AllDirectories))
                {
                    int length = info2.FullName.Length - fullName.Length;
                    string entryName = info2.FullName.Substring(fullName.Length, length).TrimStart(new[] { Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar });
                    if (info2 is FileInfo)
                    {
                        archive.CreateEntryFromFile(info2.FullName, entryName.Replace("\\", "/"));
                    }
                    else
                    {
                        DirectoryInfo possiblyEmptyDir = info2 as DirectoryInfo;
                        if ((possiblyEmptyDir != null) && IsDirEmpty(possiblyEmptyDir))
                        {
                            archive.CreateEntry(entryName + Path.AltDirectorySeparatorChar);
                        }
                    }
                }
            }
        }

        private static bool IsDirEmpty(DirectoryInfo possiblyEmptyDir)
        {
            using (IEnumerator<FileSystemInfo> enumerator = possiblyEmptyDir.EnumerateFileSystemInfos("*", SearchOption.AllDirectories).GetEnumerator())
            {
                while (enumerator.MoveNext())
                {
                    FileSystemInfo current = enumerator.Current;
                    return false;
                }
            }
            return true;
        }
    }
}