namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveSchemeFromPublicationUrl : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE dbo.Courses SET PublicationUrl = REPLACE(PublicationUrl, 'http:', '') WHERE PublicationUrl like 'http:%'");
            Sql("UPDATE dbo.LearningPaths SET PublicationUrl = REPLACE(PublicationUrl, 'http:', '') WHERE PublicationUrl like 'http:%'");
        }
        
        public override void Down()
        {
        }
    }
}
