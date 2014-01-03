﻿using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using easygenerator.Infrastructure;

namespace easygenerator.Web.BuildCourse
{
    public class BuildPackageCreator
    {
        private PhysicalFileManager _fileManager;
        private static List<string> _ignoredTypes = new List<string>(new string[] { ".exe" }); 

        public BuildPackageCreator(PhysicalFileManager fileManager)
        {
            _fileManager = fileManager;
        }

        public virtual void CreatePackageFromFolder(string packageFolderPath, string destinationFileName)
        {
            _fileManager.DeleteFile(destinationFileName);
            DoCreateFromDirectory(packageFolderPath, destinationFileName, _ignoredTypes);
        }

        private static void DoCreateFromDirectory(string sourceDirectoryName, string destinationArchiveFileName, List<string> ignoredTypes)
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
                        if (!ignoredTypes.Contains(info2.Extension.ToLower()))
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