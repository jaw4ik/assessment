namespace easygenerator.Infrastructure.Mail
{
    public interface IMailTemplatesProvider
    {
        string GetMailTemplateBody(IMailTemplate templateOptions, dynamic templateModel);
    }
}
