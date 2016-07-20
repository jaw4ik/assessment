using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public class CommandProvider: ICommandProvider
    {
        public ICommand GetAcsCommand() => CommandFactory.GetCommand(CommandFactory.AcsCommandName);
        public ICommand GetSignInCommand() => CommandFactory.GetCommand(CommandFactory.SignInCommandName);
        public ICommand GetMetadataCommand() => CommandFactory.GetCommand(CommandFactory.MetadataCommand);
    }
}