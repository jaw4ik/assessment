namespace easygenerator.Web.Mail
{
    public interface IMailSenderWrapper
    {
        void SendForgotPasswordMessage(string email, string ticketId);
        void SendInviteCollaboratorMessage(string fromEmail, string toEmail, string userName, string courseTitle);
    }
}
