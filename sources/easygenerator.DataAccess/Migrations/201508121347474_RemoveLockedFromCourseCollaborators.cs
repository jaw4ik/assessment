namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveLockedFromCourseCollaborators : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.CourseCollaborators", "Locked");
        }
        
        public override void Down()
        {
            AddColumn("dbo.CourseCollaborators", "Locked", c => c.Boolean(nullable: false));
        }
    }
}
