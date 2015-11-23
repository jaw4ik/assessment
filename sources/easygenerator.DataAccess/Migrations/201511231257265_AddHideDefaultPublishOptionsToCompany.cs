namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddHideDefaultPublishOptionsToCompany : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Companies", "HideDefaultPublishOptions", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Companies", "HideDefaultPublishOptions");
        }
    }
}
