﻿using System.IO;
using easygenerator.Web.Components;

namespace easygenerator.Web.BuildCourse
{
    public class BuildPathProvider
    {
        private string BuildPath { get; set; }
        private string WebsitePath { get; set; }
        private string DownloadPath { get; set; }

        public BuildPathProvider(HttpRuntimeWrapper httpRuntimeWrapper)
        {
            BuildPath = Path.Combine(Path.GetTempPath(), "eg", "build");
            WebsitePath = httpRuntimeWrapper.GetDomainAppPath();
            DownloadPath = Path.Combine(WebsitePath, "Download");
        }

        public virtual string GetBuildDirectoryName(params string[] buildIds)
        {
            var subPath = Path.Combine(buildIds);
            return Path.Combine(BuildPath, subPath);
        }

        #region Build Content

        public virtual string GetContentDirectoryName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "content");
        }

        public virtual string GetCourseIntroductionContentFileName(string buildDirectory)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), "content" + ".html");
        }

        public virtual string GetObjectiveDirectoryName(string buildDirectory, string objectiveId)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), objectiveId);
        }

        public virtual string GetQuestionDirectoryName(string buildDirectory, string objectiveId, string questionId)
        {
            return Path.Combine(GetObjectiveDirectoryName(buildDirectory, objectiveId), questionId);
        }

        public virtual string GetLearningContentFileName(string buildDirectory, string objectiveId, string questionId, string learningContentId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, objectiveId, questionId), learningContentId + ".html");
        }

        public virtual string GetQuestionContentFileName(string buildDirectory, string objectiveId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, objectiveId, questionId), "content" + ".html");
        }

        public virtual string GetCorrectFeedbackContentFileName(string buildDirectory, string objectiveId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, objectiveId, questionId), "correctFeedback" + ".html");
        }

        public virtual string GetIncorrectFeedbackContentFileName(string buildDirectory, string objectiveId, string questionId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildDirectory, objectiveId, questionId), "incorrectFeedback" + ".html");
        }

        public virtual string GetDataFileName(string buildDirectory)
        {
            return Path.Combine(GetContentDirectoryName(buildDirectory), "data.js");
        }

        public virtual string GetSettingsFileName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "settings.js");
        }

        public virtual string GetPublishSettingsFileName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "publishSettings.js");
        }

        public virtual string GetIncludedModulesDirectoryPath(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "includedModules");
        }

        #endregion

        public virtual string GetStartupPageFileName(string buildDirectory)
        {
            return Path.Combine(buildDirectory, "index.html");
        }

        public virtual string GetDownloadPath()
        {
            return DownloadPath;
        }

        public virtual string GetBuildPackageFileName(string buildId)
        {
            return Path.Combine(DownloadPath, buildId + ".zip");
        }

        public virtual string GetBuildedPackagePath(string packagePath)
        {
            return Path.Combine(DownloadPath, packagePath);
        }
    }
}