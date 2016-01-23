using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using NReco.PdfGenerator;

namespace easygenerator.PdfConverter.Converter
{
    public static class PdfConverter
    {
        public static void Convert(string url, string filePath, bool highQuality = false)
        {
            var htmlToPdfConverter = new HtmlToPdfConverter();
            htmlToPdfConverter.LowQuality = !highQuality;

            htmlToPdfConverter.GeneratePdfFromFile(url, null, filePath);
        }
    }
}