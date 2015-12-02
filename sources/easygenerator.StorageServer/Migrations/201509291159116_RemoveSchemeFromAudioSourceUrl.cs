namespace easygenerator.StorageServer.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveSchemeFromAudioSourceUrl : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE dbo.Audios SET Source = REPLACE(Source, 'http:', '') WHERE Source like 'http:%'");
        }
        
        public override void Down()
        {
        }
    }
}
