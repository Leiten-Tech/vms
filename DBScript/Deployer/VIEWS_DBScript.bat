
@echo off

REM MySQL credentials
@REM set MYSQL_USER="root"
@REM set MYSQL_PASSWORD="Visit@123"
@REM set MYSQL_DATABASE="vms"
@REM set MYSQL_HOST="localhost" 
@REM set MYSQL_PORT="3306"
@REM set MYSQL_USER="root"
@REM set MYSQL_PASSWORD="aipl2020"
@REM set MYSQL_DATABASE="ntn_bearing"
@REM set MYSQL_HOST="13.233.4.185" 
@REM set MYSQL_PORT="3306"
@REM set MYSQL_USER="VMS"
@REM set MYSQL_PASSWORD="Leiten@2024"
@REM set MYSQL_DATABASE="vms_test"
@REM set MYSQL_HOST="192.168.0.240" 
@REM set MYSQL_PORT="3306"
set MYSQL_USER="root"
set MYSQL_PASSWORD="Leiten@2024"
set MYSQL_DATABASE="vms_test"
set MYSQL_HOST="3.109.131.222" 
set MYSQL_PORT="3306"

REM Directory containing SQL files
set SQL_DIR=E:\TFS\VisitorManagement\General\Dev-branch\DBScript\Views

REM Loop through each SQL file in the directory and run it in MySQL
for %%f in (%SQL_DIR%\*.sql) do (
    echo Running %%f...
    mysql -h%MYSQL_HOST% -P%MYSQL_PORT% -u%MYSQL_USER% -p%MYSQL_PASSWORD% %MYSQL_DATABASE% < "%%f"
    echo Done.
)

REM Pause before closing the window
pause

