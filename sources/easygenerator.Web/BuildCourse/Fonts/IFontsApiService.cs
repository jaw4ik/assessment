using easygenerator.Web.BuildCourse.Fonts.Entities;

namespace easygenerator.Web.BuildCourse.Fonts
{
    public interface IFontsApiService
    {
        void DownloadFont(Font font, string destinationPath);
    }
}
