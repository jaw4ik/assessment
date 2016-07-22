using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class ThemeRepository : Repository<Theme>, IThemeRepository
    {
        public ThemeRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public ICollection<Theme> GetCollectionByTemplate(Template template, string username)
        {
            return GetCollection(theme => theme.CreatedBy == username && theme.Template.Id == template.Id);
        }

        public CourseTemplateSettings GetCourseTemplateSettingsWithTheme(Guid courseId, Guid templateId)
        {
            return _dataContext.GetSet<CourseTemplateSettings>()
                .Include(settings => settings.Theme)
                .SingleOrDefault(item => item.Course_Id == courseId && item.Template_Id == templateId);
        }

        public IEnumerable<CourseTemplateSettings> GetAllCourseTemplateSettingsByTheme(Theme theme)
        {
            return _dataContext.GetSet<CourseTemplateSettings>()
                .Include(settings => settings.Theme)
                .Where(item => item.Theme.Id == theme.Id).ToList();
        }
    }
}
