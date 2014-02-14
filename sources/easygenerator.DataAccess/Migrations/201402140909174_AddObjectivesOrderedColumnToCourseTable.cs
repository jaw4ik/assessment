namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddObjectivesOrderedColumnToCourseTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Courses", "ObjectivesOrder", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Courses", "ObjectivesOrder");
        }
    }
}
