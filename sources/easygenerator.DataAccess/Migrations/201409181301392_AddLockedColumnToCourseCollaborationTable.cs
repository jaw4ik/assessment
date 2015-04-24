namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLockedColumnToCourseCollaborationTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CourseCollaborators", "Locked", c => c.Boolean(nullable: false));

            Sql(@"
                    UPDATE cc SET cc.Locked = ci.Locked
                    FROM CourseCollaborators cc
                    INNER JOIN
                    (
	                    SELECT Email, AccessType, [Count], AllowedCount, CASE SIGN([Count] - AllowedCount) WHEN 1 THEN 1 ELSE 0 END AS Locked
	                    FROM 
	                    (
		                    SELECT u.Email, u.AccessType, count(*) as Count,
		                    CASE SIGN(u.AccessType - 1) WHEN 1 THEN 2147483647 WHEN 0 THEN 3 ELSE 0 END AS AllowedCount
		                    FROM Users u 
		                    INNER JOIN CourseCollaborators cc
		                    ON u.Email = cc.CreatedBy
		                    GROUP BY u.Email, u.AccessType
	                    ) AS CollaborationInfo
                    ) ci
                    ON ci.Email = cc.CreatedBy
            ");
        }

        public override void Down()
        {
            DropColumn("dbo.CourseCollaborators", "Locked");
        }
    }
}
