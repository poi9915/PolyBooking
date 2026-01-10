@echo off
echo ===============================
echo  Auto cleaning project folders
echo ===============================

set folders=.vscode .expo node_modules android

for %%F in (%folders%) do (
    if exist "%%F\" (
        echo [DELETE] Removing folder: %%F
        rmdir /s /q "%%F"
    ) else (
        echo [SKIP] Folder not found: %%F
    )
)

echo ===============================
echo  Done!
pause
