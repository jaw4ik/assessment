-----------------------REMOVE SPLIT FUNCTION IF EXISTS---------------------------------
IF EXISTS (SELECT *
           FROM   sys.objects
           WHERE  object_id = OBJECT_ID(N'[dbo].[splitstring]')
                  AND type IN ( N'FN', N'IF', N'TF', N'FS', N'FT' ))
  DROP FUNCTION [dbo].[splitstring]
GO 
---------------------------------------------------------------------------------------
----------------------CREATE SPLIT FUNCTION--------------------------------------------
CREATE FUNCTION dbo.splitstring ( @stringToSplit VARCHAR(MAX) )
	RETURNS
		@returnList TABLE ([Name] [nvarchar] (500))
	AS
	BEGIN
		DECLARE @name NVARCHAR(255)
		DECLARE @pos INT

		WHILE CHARINDEX(',', @stringToSplit) > 0
		BEGIN
		SELECT @pos  = CHARINDEX(',', @stringToSplit)  
		SELECT @name = SUBSTRING(@stringToSplit, 1, @pos-1)

		INSERT INTO @returnList
		SELECT RTRIM(LTRIM(@name))

		SELECT @stringToSplit = SUBSTRING(@stringToSplit, @pos+1, LEN(@stringToSplit)-@pos)
		END

		INSERT INTO @returnList
		SELECT RTRIM(LTRIM(@stringToSplit))

		RETURN
	END
GO
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------

DECLARE @organizationCreatedDate datetime, @organizationAdmin nvarchar(254), @organizationEmailDomain nvarchar(254);

DECLARE organization_cursor CURSOR FOR  
SELECT CreatedOn, CreatedBy, Name FROM Organizations 
CROSS APPLY splitstring(EmailDomains) 
WHERE EmailDomains IS NOT NULL;  
  
OPEN organization_cursor;  
  
FETCH NEXT FROM organization_cursor  
INTO @organizationCreatedDate, @organizationAdmin, @organizationEmailDomain;  
  
WHILE @@FETCH_STATUS = 0  
BEGIN  

INSERT INTO dbo.CourseCollaborators
(     [Id]
      ,[CreatedBy]
      ,[CreatedOn]
      ,[ModifiedBy]
      ,[ModifiedOn]
      ,[Course_Id]
      ,[Email]
      ,[IsAccepted]
      ,[IsAdmin])
SELECT 
	NEWID(), 
	c.CreatedBy, 
	@organizationCreatedDate, 
	c.CreatedBy, 
	@organizationCreatedDate, 
	c.Id, 
	@organizationAdmin, 
	1,
	1
FROM dbo.Courses c INNER JOIN dbo.OrganizationUsers ou ON c.CreatedBy = ou.Email  
	WHERE c.CreatedBy LIKE '%' + @organizationEmailDomain 
	AND ou.Status = 1 AND NOT EXISTS (SELECT Course_Id FROM dbo.CourseCollaborators WHERE Email = @organizationAdmin AND Course_Id = c.Id)
 
	FETCH NEXT FROM organization_cursor  
	INTO @organizationCreatedDate, @organizationAdmin, @organizationEmailDomain;  
END  
  
CLOSE organization_cursor;  
DEALLOCATE organization_cursor;  
GO  