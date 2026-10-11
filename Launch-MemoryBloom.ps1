# ==============================================================================
# Launch-MemoryBloom.ps1 - PowerShell Desktop Launcher
# ==============================================================================
$ErrorActionPreference = "SilentlyContinue"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$nodePath = "C:\Users\nithy\AppData\Roaming\Antigravity\bin\agy-node.cmd"
if (-not (Test-Path $nodePath)) {
    $nodePath = "node"
}

Write-Host "========================================================" -ForegroundColor Green
Write-Host "       Starting MemoryBloom App for Windows" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green

# Start server as background process
$serverProcess = Start-Process -FilePath $nodePath -ArgumentList "server.js" -WorkingDirectory $scriptDir -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 2

# Open Edge in Standalone App Window mode
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

if (Test-Path $edgePath) {
    Start-Process -FilePath $edgePath -ArgumentList "--app=http://localhost:3000", "--window-size=920,950"
} else {
    Start-Process "http://localhost:3000"
}

Write-Host "MemoryBloom is running at http://localhost:3000" -ForegroundColor Yellow
Write-Host "To access on Android: Connect to same Wi-Fi and open http://10.184.103.76:3000" -ForegroundColor Cyan
