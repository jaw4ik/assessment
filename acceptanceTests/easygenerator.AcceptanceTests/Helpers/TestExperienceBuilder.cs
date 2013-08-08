using System;
using System.IO;
using System.Net;
using System.Text;

namespace easygenerator.AcceptanceTests.Helpers
{
    public class TestExperienceBuilder
    {
        public string BuildExperience(string dataFileName, string buildServerUrl = "http://localhost:5656/experience/build")
        {
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(buildServerUrl);

            ASCIIEncoding encoding = new ASCIIEncoding();
            string postData = File.Exists(dataFileName) ? File.ReadAllText(dataFileName) : String.Empty;
            byte[] data = encoding.GetBytes(postData);

            httpWebRequest.Method = "POST";
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.ContentLength = data.Length;

            using (Stream stream = httpWebRequest.GetRequestStream())
            {
                stream.Write(data, 0, data.Length);
            }

            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();

            return new StreamReader(response.GetResponseStream()).ReadToEnd();
        }
    }
}