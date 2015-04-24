namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPublicationUrlColumnToCourse : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Courses", "PublicationUrl", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Courses", "PublicationUrl");
        }
    }
}
