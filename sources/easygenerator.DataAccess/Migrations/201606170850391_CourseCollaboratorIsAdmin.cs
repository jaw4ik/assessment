namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CourseCollaboratorIsAdmin : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CourseCollaborators", "IsAdmin", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.CourseCollaborators", "IsAdmin");
        }
    }
}
