using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;
using System;
using System.Linq;
using System.Text;

namespace easygenerator.Web.BuildLearningPath
{
    public class StartupPageGenerator
    {
        public virtual string Generate(LearningPath learningPath)
        {
            var stringBuilder = new StringBuilder();
            stringBuilder.AppendLine("<!DOCTYPE html>");
            stringBuilder.AppendLine("<html>");
            stringBuilder.AppendLine(String.Format("<head><title>{0}</title></head>", learningPath.Title));
            stringBuilder.AppendLine("<body>");

            if (learningPath.Courses.Any())
            {
                stringBuilder.AppendLine("<ul>");

                foreach (var course in learningPath.Courses)
                {
                    stringBuilder.AppendLine(String.Format("<li><a href=\"{0}\">{1}</a></li>",
                        course.Id.ToNString() + "/index.html", course.Title));
                }

                stringBuilder.AppendLine("</ul>");
            }

            stringBuilder.AppendLine("</body>");
            stringBuilder.AppendLine("</html>");
            return stringBuilder.ToString();
        }
    }
}