using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IThemeRepository : IRepository<Theme>
    {
        ICollection<Theme> GetCollectionByTemplate(Template template, string name);
        IEnumerable<CourseTemplateSettings> GetAllCourseTemplateSettingsByTheme(Theme theme);
        CourseTemplateSettings GetCourseTemplateSettingsWithTheme(Guid courseId, Guid templateId);
    }
}
