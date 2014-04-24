using System;
using System.IO;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using Newtonsoft.Json.Linq;

namespace easygenerator.Web.Import.PublishedCourse.EntityReaders
{
    public class CourseEntityReader
    {
        public CourseEntityReader(FileCache fileCache, IEntityFactory entityFactory, ITemplateRepository templateRepository)
        {
            _fileCache = fileCache;
            _entityFactory = entityFactory;
            _templateRepository = templateRepository;
        }

        private readonly FileCache _fileCache;
        private readonly IEntityFactory _entityFactory;
        private readonly ITemplateRepository _templateRepository;

        public virtual Course ReadCourse(string publishedPackagePath, string createdBy, JObject courseData)
        {
            var course = _entityFactory.Course(courseData.Value<string>("title"), _templateRepository.GetDefaultTemplate(), createdBy);

            var hasIntroductionContent = courseData.Value<bool>("hasIntroductionContent");
            if (hasIntroductionContent)
            {
                var contentPath = Path.Combine(publishedPackagePath, "content", "content.html");
                course.UpdateIntroductionContent(_fileCache.ReadFromCacheOrLoad(contentPath), createdBy);
            }
            else
            {
                course.UpdateIntroductionContent(String.Empty, createdBy);
            }

            return course;
        }

    }
}