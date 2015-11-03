namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddUniqueIndexForCourseStates : DbMigration
    {
        public override void Up()
        {
            Sql("WITH cte AS (SELECT ROW_NUMBER() OVER (PARTITION BY Course_Id ORDER BY (SELECT 0)) RN FROM dbo.CourseStates) DELETE FROM cte WHERE  RN > 1");
            DropIndex("dbo.CourseStates", new[] { "Course_Id" });
            CreateIndex("dbo.CourseStates", "Course_Id", unique: true);
        }

        public override void Down()
        {
            DropIndex("dbo.CourseStates", new[] { "Course_Id" });
            CreateIndex("dbo.CourseStates", "Course_Id");
        }
    }
}
