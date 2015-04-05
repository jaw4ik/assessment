namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLearningContentsOrderFieldToQuestion : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Questions", "LearningContentsOrder", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Questions", "LearningContentsOrder");
        }
    }
}
