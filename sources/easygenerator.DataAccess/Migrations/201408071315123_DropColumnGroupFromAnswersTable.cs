namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DropColumnGroupFromAnswersTable : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Answers", "Group");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Answers", "Group", c => c.Guid(nullable: false, defaultValue: default(Guid)));
        }
    }
}
