
namespace easygenerator.Infrastructure
{
    public class Errors
    {
        public const string CourseNotFoundError = "Course is not found";
        public const string OrganizationNotFoundError = "Organization is not found";
        public const string OrganizationUserNotFoundError = "Organization user is not found";
        public const string DocumentNotFoundError = "Document is not found";
        public const string SectionNotFoundError = "Section is not found";
        public const string SectionsNotFoundError = "Sections are not found";
        public const string QuestionNotFoundError = "Question is not found";
        public const string AnswerNotFoundError = "Answer is not found";
        public const string LearningContentNotFoundError = "Learning Content is not found";
        public const string TemplateNotFoundError = "Template is not found";
        public const string ThemeNotFoundError = "Theme is not found";
        public const string SectionCannotBeDeleted = "Section can not be deleted";
        public const string CoursePublishActionFailedError = "Failed. Try again.";
        public const string LearningPathBuildActionFailedError = "Failed. Try again.";
        public const string CollaboratorNotFoundError = "Collaborator is not found";
        public const string LearningPathNotFoundError = "Learning path is not found";
        public const string LearningPathPublishActionFailedError = "Failed. Try again.";

        public const string CoggnoSamlServiceProviderNotAllowed = "Coggno is not allowed SAML Service Provider for current user yet. Allow Coggno firstly.";
        public const string CourseCoggnoProcessingFailed = "Course processing failed in Coggno";
        public const string CourseIdHasInvalidFormat = "Course Id has invalid format";
        public const string CourseIsBeingProcessedAndCannotBePublished = "Course is being processed and can't be published for now";
        public const string CourseHasNotBeenPublishedByTheOwner = "Course hasn't been published to Coggno by the owner yet";
        public const string CourseNotFoundResourceKey = "courseNotFoundError";
        public const string DocumentNotFoundResourceKey = "documentNotFoundError";
        public const string LearningPathNotFoundResourceKey = "learningPathNotFoundError";
        public const string SectionNotFoundResourceKey = "sectionNotFoundError";
        public const string SectionsNotFoundResourceKey = "sectionsNotFoundError";
        public const string QuestionNotFoundResourceKey = "questionNotFoundError";
        public const string AnswerNotFoundResourceKey = "answerNotFoundError";
        public const string LearningContentNotFoundResourceKey = "learningContentNotFoundError";
        public const string SectionCannotBeDeletedResourceKey = "sectionCannnotBeDeleted";
        public const string CoursePublishActionFailedResourceKey = "publishFailed";
        public const string LearningPathBuildActionFailedResourceKey = "learningPathBuildFailed";
        public const string LearningPathPublishActionFailedResourceKey = "publishFailed";

        public const string UpgradeToStarterPlanToUseScormResourceKey = "upgradeToStarterPlanToUseScormErrorMessage";
        public const string UpgradeToStarterPlanToUseCommentsErrorMessage = "upgradeToStarterPlanToUseCommentsErrorMessage";
        public const string UpgradeAccountToCreateAdvancedQuestionTypes = "upgradeAccountToCreateAdvancedQuestionTypes";
        public const string UpgradeToPlusPlanToSellCourses = "upgradeToPlusPlanToSellCourses";
        public const string UpgradeAccountToSaveThemes = "upgradeAccountToSaveThemes";
        public const string UpgradeAccountToManageOrganization = "upgradeAccountToManageOrganization";

        public const string UpgradeToNextPlanToCreateMoreCoursesErrorMessage = "upgradeToNextPlanToCreateMoreCoursesErrorMessage";
        public const string NotEnoughPermissionsErrorMessageKey = "notEnoughPermissionsErrorMessage";
        public const string DataHasBeenChangedErrorMessageKey = "dataHasBeenChangedErrorMessage";
        public const string UserWithSpecifiedEmailDoesntExist = "Account with this email doesn't exist";
        public const string UserWithSpecifiedEmailDoesntExistResourceKey = "enterEmailOfExistingUser";

        public const string UserDoesntExist = "User doesn't exist";
        public const string UserDoesntExistResourceKey = "responseFailed";
        public const string UserNotMemberOfCompany = "Current user is not a member of given company";
        public const string UserNotMemberOfCompanyResourceKey = "userNotMemberOfCompany";

        public const string ProjectDoesntExist = "Project doesn't exist";
    }
}
