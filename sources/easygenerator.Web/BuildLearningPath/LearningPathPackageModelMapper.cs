using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildLearningPath.PackageModel;
using easygenerator.Web.Extensions;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathPackageModelMapper
    {
        private LearningPathContentPathProvider _contentProvider;

        public LearningPathPackageModelMapper(LearningPathContentPathProvider contentProvider)
        {
            _contentProvider = contentProvider;
        }

        public virtual LearningPathPackageModel MapLearningPath(LearningPath learningPath)
        {
            if (learningPath == null)
            {
                throw new ArgumentNullException();
            }

            return new LearningPathPackageModel()
            {
                Id = learningPath.Id.ToNString(),
                CreatedOn = DateTimeWrapper.Now(),
                Title = learningPath.Title,
                Entities = (learningPath.Entities ?? new Collection<ILearningPathEntity>()).Select(MapEntity).ToList()
            };
        }

        private ILearningPathEntityPackageModel MapEntity(ILearningPathEntity entity)
        {
            if (entity is Course)
            {
                return MapCourse((Course) entity);
            }
            return MapDocument((Document) entity);
        }

        private LearningPathCoursePackageModel MapCourse(Course course)
        {
            return new LearningPathCoursePackageModel()
            {
                Type = LearningPathEntityType.Course,
                Title = course.Title,
                Link = _contentProvider.GetEntityLink(course.Id.ToNString())
            };
        }

        private LearningPathDocumentPackageModel MapDocument(Document document)
        {
            return new LearningPathDocumentPackageModel()
            {
                Type = LearningPathEntityType.Document,
                Title = document.Title,
                Link = _contentProvider.GetEntityLink(document.Id.ToNString())
            };
        }
    }
}