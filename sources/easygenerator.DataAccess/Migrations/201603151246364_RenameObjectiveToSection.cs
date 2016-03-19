namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenameObjectiveToSection : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.Objectives", newName: "Sections");
            RenameTable(name: "dbo.CourseObjectives", newName: "CourseSections");
            RenameColumn(table: "dbo.Questions", name: "Objective_Id", newName: "Section_Id");
            RenameColumn(table: "dbo.CourseSections", name: "Objective_Id", newName: "Section_Id");
            RenameIndex(table: "dbo.Questions", name: "IX_Objective_Id", newName: "IX_Section_Id");
            RenameIndex(table: "dbo.CourseSections", name: "IX_Objective_Id", newName: "IX_Section_Id");
            AddColumn("dbo.Courses", "SectionsOrder", c => c.String());
            AddColumn("dbo.Onboardings", "SectionCreated", c => c.Boolean(nullable: false));
            DropColumn("dbo.Courses", "ObjectivesOrder");
            DropColumn("dbo.Onboardings", "ObjectiveCreated");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Onboardings", "ObjectiveCreated", c => c.Boolean(nullable: false));
            AddColumn("dbo.Courses", "ObjectivesOrder", c => c.String());
            DropColumn("dbo.Onboardings", "SectionCreated");
            DropColumn("dbo.Courses", "SectionsOrder");
            RenameIndex(table: "dbo.CourseSections", name: "IX_Section_Id", newName: "IX_Objective_Id");
            RenameIndex(table: "dbo.Questions", name: "IX_Section_Id", newName: "IX_Objective_Id");
            RenameColumn(table: "dbo.CourseSections", name: "Section_Id", newName: "Objective_Id");
            RenameColumn(table: "dbo.Questions", name: "Section_Id", newName: "Objective_Id");
            RenameTable(name: "dbo.CourseSections", newName: "CourseObjectives");
            RenameTable(name: "dbo.Sections", newName: "Objectives");
        }
    }
}
