@echo off

if exist node_modules (
    echo node_modules found . running expo
    npx expo start --go
) else (
    echo node_modules not found . running npm install
    npm install && npx expo start --go
)