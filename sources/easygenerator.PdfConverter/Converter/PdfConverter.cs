using NReco.PdfGenerator;

namespace easygenerator.PdfConverter.Converter
{
    public static class PdfConverter
    {
        public static void Convert(string url, string filePath, bool highQuality = false)
        {
            CreateConverterInstance(highQuality, " --window-status READY ").GeneratePdfFromFile(url, null, filePath);
        }

        public static byte[] ConvertWithoutSaving(string url, bool highQuality = false)
        {
            return CreateConverterInstance(highQuality, " --window-status READY ").GeneratePdfFromFile(url, null);
        }

        private static HtmlToPdfConverter CreateConverterInstance(bool highQuality, string customWkHtmlArgs)
        {
            var htmlToPdfConverter = new HtmlToPdfConverter();
            htmlToPdfConverter.LowQuality = !highQuality;
            htmlToPdfConverter.CustomWkHtmlArgs = customWkHtmlArgs;

            return htmlToPdfConverter;
        }
    }
}