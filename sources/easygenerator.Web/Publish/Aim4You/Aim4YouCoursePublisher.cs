using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using System;

namespace easygenerator.Web.Publish.Aim4You
{
    public class Aim4YouCoursePublisher : IAim4YouCoursePublisher
    {
        private readonly IAim4YouApiService _aim4YouApiService;
        private readonly BuildPathProvider _pathProvider;
        private readonly PhysicalFileManager _fileManager;

        public Aim4YouCoursePublisher(IAim4YouApiService aim4YouApiService, PhysicalFileManager fileManager, BuildPathProvider pathProvider)
        {
            _pathProvider = pathProvider;
            _aim4YouApiService = aim4YouApiService;
            _fileManager = fileManager;
        }

        public bool PublishCourse(string userEmail, Course course, string domain)
        {
            if (!CheckRegistration(userEmail, domain))
            {
                return false;
            }

            Guid? aim4YouCourseId = null;

            #region Determine aim4You course id

            if (course.IsRegisteredOnAimForYou())
            {
                // we should check if existing aim4YouCourseId is valid (exists in aim4You), because course can be manually deleted from aim4You backoffice.
                if (_aim4YouApiService.IsCourseRegistered(course.Aim4YouIntegration.Aim4YouCourseId))
                {
                    aim4YouCourseId = course.Aim4YouIntegration.Aim4YouCourseId;
                }
            }

            // if aim4YouCourseId is not define we should register course.
            if (!aim4YouCourseId.HasValue)
            {
                aim4YouCourseId = _aim4YouApiService.RegisterCourse(userEmail, course.Id, course.Title);
            }

            #endregion

            if (aim4YouCourseId.HasValue)
            {
                course.RegisterOnAim4YOu(aim4YouCourseId.Value);
                return _aim4YouApiService.UploadCourse(aim4YouCourseId.Value, course.Title, GetCourseBytes(course)) && _aim4YouApiService.DeployCourse(aim4YouCourseId.Value);
            }

            return false;
        }

        private bool CheckRegistration(string userEmail, string domain)
        {
            return _aim4YouApiService.IsUserRegistered(userEmail, domain) || _aim4YouApiService.RegisterUser(userEmail, domain);
        }

        private byte[] GetCourseBytes(Course course)
        {
            string buildPackagePath = _pathProvider.GetBuildedPackagePath(course.PackageUrl);
            return _fileManager.GetFileBytes(buildPackagePath);
        }
    }
}