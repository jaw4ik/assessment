namespace easygenerator.Web.BuildCourse.Fonts.Entities
{
    public class Font
    {
        public string FontFamily { get; }
        public string Weight { get; }

        public Font(string fontFamily, string weight = null)
        {
            FontFamily = fontFamily;
            Weight = weight ?? "400";
        }

        public override bool Equals(object obj)
        {
            var other = obj as Font;
            if (other == null)
            {
                return false;
            }

            return other.FontFamily == FontFamily && other.Weight == Weight;
        }

        public override int GetHashCode()
        {
            return (FontFamily + Weight).GetHashCode();
        }
    }
}