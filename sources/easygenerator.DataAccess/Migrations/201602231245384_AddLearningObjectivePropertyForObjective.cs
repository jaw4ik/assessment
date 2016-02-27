namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLearningObjectivePropertyForObjective : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Objectives", "LearningObjective", c => c.String(maxLength: 255));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Objectives", "LearningObjective");
        }
    }
}
