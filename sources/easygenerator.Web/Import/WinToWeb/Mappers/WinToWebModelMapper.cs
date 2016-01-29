using System;
using System.IO;
using easygenerator.Web.Import.WinToWeb.Model;
using Newtonsoft.Json;

namespace easygenerator.Web.Import.WinToWeb.Mappers
{
    public interface IWinToWebModelMapper
    {
        WinCourse Map(Stream stream);
    }
    public class WinToWebModelMapper : IWinToWebModelMapper
    {
        public WinCourse Map(Stream stream)
        {
            try
            {
                string data;
                using (var streamReader = new StreamReader(stream))
                {
                    stream.Seek(0, SeekOrigin.Begin);
                    streamReader.DiscardBufferedData();
                    data = streamReader.ReadToEnd();
                }
                if (string.IsNullOrEmpty(data))
                {
                    return null;
                }
                var course = JsonConvert.DeserializeObject<WinCourse>(data);
                return course;
            }
            catch
            {
                return null;
            }
        }
    }
}