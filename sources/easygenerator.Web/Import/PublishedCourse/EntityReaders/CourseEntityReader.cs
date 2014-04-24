using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace easygenerator.Web.Import.PublishedCourse.EntityReaders
{
    public class CourseEntityReader
    {
        public CourseEntityReader(ImportContentReader importContentReader, IEntityFactory entityFactory, ITemplateRepository templateRepository)
        {
            _importContentReader = importContentReader;
            _entityFactory = entityFactory;
            _templateRepository = templateRepository;
        }

        private readonly ImportContentReader _importContentReader;
        private readonly IEntityFactory _entityFactory;
        private readonly ITemplateRepository _templateRepository;

        public virtual Course ReadCourse(string publishedPackagePath, string createdBy, JObject courseData)
        {
            var course = _entityFactory.Course(courseData.Value<string>("title"), _templateRepository.GetDefaultTemplate(), createdBy);

            var hasIntroductionContent = courseData.Value<bool>("hasIntroductionContent");
            if (hasIntroductionContent)
            {
                var contentPath = Path.Combine(publishedPackagePath, "content", "content.html");
                course.UpdateIntroductionContent(_importContentReader.ReadContent(contentPath), createdBy);
            }
            else
            {
                course.UpdateIntroductionContent(String.Empty, createdBy);
            }

            return course;
        }
    }
}