@echo off
setlocal

for %%f in ("%CD%") do set folder=%%~nxf
if NOT "%folder%" == "heroku" GOTO END


set project_client_dir=%~dp0..\client
set project_server_dir=%~dp0..\server
set docker_client_dir=%~dp0client
set docker_server_dir=%~dp0server

echo *** removing old dirs from %~dp0
rmdir /S %docker_client_dir%
rmdir /S %docker_server_dir%

echo.
echo *** creating new dirs
mkdir %docker_client_dir%
mkdir %docker_server_dir%\src

echo.
echo *** copying client files
xcopy /Y /E %project_client_dir%\build\ %docker_client_dir%

echo.
echo *** copying server files
copy %project_server_dir%\src %docker_server_dir%\src\
copy %project_server_dir%\package-lock.json %docker_server_dir%\
copy %project_server_dir%\package.json %docker_server_dir%\
copy %project_server_dir%\tsconfig.json %docker_server_dir%\


:END
endlocal
pause
exit