using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.BuildCourse.GoogleFonts.Entities
{
    public class GoogleFonts
    {
        public List<GoogleFont> Items { get; set; }
    }

    public class GoogleFont
    {
        public string Family { get; set; }
        public GoogleFontFiles Files { get; set; }
    }

    public class GoogleFontFiles
    {
        public string Regular { get; set; }
    }
}