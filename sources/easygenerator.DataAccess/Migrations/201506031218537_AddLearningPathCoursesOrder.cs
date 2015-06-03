namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLearningPathCoursesOrder : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.LearningPaths", "CoursesOrder", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.LearningPaths", "CoursesOrder");
        }
    }
}
