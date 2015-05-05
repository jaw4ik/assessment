namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddImageUrlFieldToObjectivesTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Objectives", "ImageUrl", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Objectives", "ImageUrl");
        }
    }
}
