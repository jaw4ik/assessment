namespace easygenerator.Web.Mail
{
    public interface IMailSenderWrapper
    {
        void SendForgotPasswordMessage(string email, string ticketId);
        void SendConfirmEmailMessage(string email, string username, string ticketId);
        void SendInviteCollaboratorMessage(string email, string userName, string courseTitle);
        void SendInviteOrganizationUserMessage(string email, string userName, string organizationTitle);
        void SendInviteUserToTheCourseMessage(string email, string userName, string courseTitle, string courseUrl);
    }
}
