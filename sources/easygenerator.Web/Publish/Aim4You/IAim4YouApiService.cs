using System;

namespace easygenerator.Web.Publish.Aim4You
{
    public interface IAim4YouApiService
    {
        bool RegisterUser(string userEmail, string domain);
        bool IsUserRegistered(string userEmail, string domain);
        Guid? RegisterCourse(string userEmail, Guid courseId, string courseTitle);
        bool UploadCourse(Guid courseId, string courseTitle, byte[] courseBytes);
        bool DeployCourse(Guid courseId);
        bool IsCourseRegistered(Guid aim4YouCourseId);
    }
}
