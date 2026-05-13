@ECHO OFF

SET result=""
SET command="%~1"
SET name="%~2"
SET directory="%~f3"

IF %directory% == "" SET directory=%CD%

SET program_command=""
IF %command% == "add" SET program_command="true"
IF %command% == "help" SET program_command="true"
IF %command% == "list" SET program_command="true"
IF %command% == "delete" SET program_command="true"
IF %command% == "rename" SET program_command="true"
IF %command% == "windows" SET program_command="true"
IF %command% == "uninstall" SET program_command="true"

IF %program_command% == "true" (
  IF %name% == "" (
    node.exe "%~dp0\..\run.js" %command%
  ) ELSE (
    IF %directory% == "" (
      node.exe "%~dp0\..\run.js" %command% %name%
    ) ELSE (
      node.exe "%~dp0\..\run.js" %command% %name% %directory%
    )
  )
) ELSE (
  IF %command% == "" (
    node.exe "%~dp0\..\run.js
  ) ELSE (
    FOR /f %%i IN ('node.exe "%~dp0\..\run.js" %command%') DO (
      IF EXIST %%i\ (
        CD %%i
      ) ElSE (
        node.exe "%~dp0\..\run.js" %command%
      )
    )
  )
)