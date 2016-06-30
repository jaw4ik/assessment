namespace easygenerator.Web.Mail
{
    public interface IMailSenderWrapper
    {
        void SendForgotPasswordMessage(string email, string ticketId);
        void SendInviteCollaboratorMessage(string email, string userName, string courseTitle);
        void SendInviteOrganizationUserMessage(string email, string userName, string organizationTitle);
    }
}
