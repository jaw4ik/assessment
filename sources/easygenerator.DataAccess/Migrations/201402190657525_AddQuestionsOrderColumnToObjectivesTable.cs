namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddQuestionsOrderColumnToObjectivesTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Objectives", "QuestionsOrder", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Objectives", "QuestionsOrder");
        }
    }
}
