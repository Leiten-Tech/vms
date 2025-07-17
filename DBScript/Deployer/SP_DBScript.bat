
@echo off

REM MySQL credentials
set MYSQL_USER="VMS"
set MYSQL_PASSWORD="Leiten@2024*"
set MYSQL_DATABASE="vms_web"
set MYSQL_HOST="192.168.10.141" 
set MYSQL_PORT="3306"
@REM set MYSQL_USER="VMS"
@REM set MYSQL_PASSWORD="Leiten@2024"
@REM set MYSQL_DATABASE="vms_testing"
@REM set MYSQL_HOST="192.168.0.240" 
@REM set MYSQL_PORT="3306"
@REM set MYSQL_USER="root"
@REM set MYSQL_PASSWORD="aipl2020"
@REM set MYSQL_DATABASE="ntn_bearing"
@REM set MYSQL_HOST="13.233.4.185" 
@REM set MYSQL_PORT="3306"
@REM set MYSQL_USER="VMS"
@REM set MYSQL_PASSWORD="Leiten@2024*"
@REM set MYSQL_DATABASE="vms_test"
@REM set MYSQL_HOST="192.168.1.240" 
@REM set MYSQL_PORT="3306"
@REM set MYSQL_USER="root"
@REM set MYSQL_PASSWORD="Leiten@2024"
@REM set MYSQL_DATABASE="ssmpl_live"
@REM set MYSQL_HOST="3.6.39.244"
@REM set MYSQL_PORT="3306"

REM Directory containing SQL files
set SQL_DIR=C:\TFS\VMS\VisitorManagement\General\Dev-branch\DBScript\Stored_Procedures

REM Loop through each SQL file in the directory and run it in MySQL
for %%f in (%SQL_DIR%\*.sql) do (
    echo Running %%f...
    mysql -h%MYSQL_HOST% -P%MYSQL_PORT% -u%MYSQL_USER% -p%MYSQL_PASSWORD% %MYSQL_DATABASE% < "%%f"
    echo Done.
)

REM Pause before closing the window
pause

