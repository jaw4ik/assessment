// <auto-generated />
namespace easygenerator.StorageServer.DataAccess.Migrations
{
    using System.CodeDom.Compiler;
    using System.Data.Entity.Migrations;
    using System.Data.Entity.Migrations.Infrastructure;
    using System.Resources;
    
    [GeneratedCode("EntityFramework.Migrations", "6.1.3-40302")]
    public sealed partial class RemoveSchemeFromAudioSourceUrl : IMigrationMetadata
    {
        private readonly ResourceManager Resources = new ResourceManager(typeof(RemoveSchemeFromAudioSourceUrl));
        
        string IMigrationMetadata.Id
        {
            get { return "201509291159116_RemoveSchemeFromAudioSourceUrl"; }
        }
        
        string IMigrationMetadata.Source
        {
            get { return null; }
        }
        
        string IMigrationMetadata.Target
        {
            get { return Resources.GetString("Target"); }
        }
    }
}