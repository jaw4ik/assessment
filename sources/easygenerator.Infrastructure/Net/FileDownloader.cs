using System.Net;

namespace easygenerator.Infrastructure.Net
{
    public class FileDownloader
    {
        public virtual void DownloadFile(string fileUrl, string destinationPath)
        {
            if (fileUrl.StartsWith("//"))
            {
                fileUrl = "http:" + fileUrl;
            }

            using (var client = new WebClient())
            {
                client.DownloadFile(fileUrl, destinationPath);
            }
        }
    }
}
