namespace easygenerator.Infrastructure
{
    public interface IPhysicalFileManager
    {
        void CreateDirectory(string path);
        void DeleteDirectory(string path);
        void CopyDirectory(string source, string destination);
        void WriteToFile(string path, string content);
        void ArchiveDirectory(string path, string destinationFilePath);
        void DeleteFile(string path);
    }
}
