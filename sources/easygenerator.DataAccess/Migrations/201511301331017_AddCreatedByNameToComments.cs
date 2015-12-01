namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCreatedByNameToComments : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Comments", "CreatedByName", c => c.String(nullable: false, maxLength: 255));
            Sql("UPDATE dbo.Comments SET CreatedByName = 'Anonymous'");
        }
        
        public override void Down()
        {
            DropColumn("dbo.Comments", "CreatedByName");
        }
    }
}
