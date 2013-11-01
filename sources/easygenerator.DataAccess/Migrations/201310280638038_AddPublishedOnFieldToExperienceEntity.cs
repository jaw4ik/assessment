namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddPublishedOnFieldToExperienceEntity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Experiences", "PublishedOn", c => c.DateTime());
        }

        public override void Down()
        {
            DropColumn("dbo.Experiences", "PublishedOn");
        }
    }
}
