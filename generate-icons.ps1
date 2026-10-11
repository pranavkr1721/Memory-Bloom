Add-Type -AssemblyName System.Drawing

function Create-AppIcon {
    param([int]$size, [string]$outputPath)
    
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)
    
    # Outer Rounded Rectangle / Squircle
    $bgColor = [System.Drawing.Color]::FromArgb(255, 45, 106, 79) # #2D6A4F
    $bgBrush = New-Object System.Drawing.SolidBrush($bgColor)
    $radius = [int]($size * 0.22)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $path.AddArc(0, 0, $diameter, $diameter, 180, 90)
    $path.AddArc($size - $diameter, 0, $diameter, $diameter, 270, 90)
    $path.AddArc($size - $diameter, $size - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc(0, $size - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    $g.FillPath($bgBrush, $path)
    
    # Draw glowing central flower / memory blossom
    $center = $size / 2.0
    $petalBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 253, 203, 110)) # Soft Gold
    $coreBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 235, 104, 76)) # Warm Coral
    $nodeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 129, 236, 236)) # Gentle Teal
    
    # 5 Petals around center
    $petalDist = $size * 0.16
    $petalSize = $size * 0.22
    for ($i = 0; $i -lt 5; $i++) {
        $angle = $i * 72 * [Math]::PI / 180.0
        $px = $center + [Math]::Cos($angle) * $petalDist - ($petalSize / 2.0)
        $py = $center + [Math]::Sin($angle) * $petalDist - ($petalSize / 2.0)
        $g.FillEllipse($petalBrush, [float]$px, [float]$py, [float]$petalSize, [float]$petalSize)
    }
    
    # Core circle
    $coreSize = $size * 0.20
    $g.FillEllipse($coreBrush, [float]($center - $coreSize / 2.0), [float]($center - $coreSize / 2.0), [float]$coreSize, [float]$coreSize)
    
    # 5 Outer memory nodes (pattern stars)
    $nodeDist = $size * 0.35
    $nodeSize = $size * 0.08
    for ($i = 0; $i -lt 5; $i++) {
        $angle = ($i * 72 + 36) * [Math]::PI / 180.0
        $nx = $center + [Math]::Cos($angle) * $nodeDist - ($nodeSize / 2.0)
        $ny = $center + [Math]::Sin($angle) * $nodeDist - ($nodeSize / 2.0)
        $g.FillEllipse($nodeBrush, [float]$nx, [float]$ny, [float]$nodeSize, [float]$nodeSize)
    }
    
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created $outputPath ($size x $size)"
}

Create-AppIcon -size 192 -outputPath "C:\Users\nithy\.gemini\antigravity\scratch\memory-care-app\icons\icon-192.png"
Create-AppIcon -size 512 -outputPath "C:\Users\nithy\.gemini\antigravity\scratch\memory-care-app\icons\icon-512.png"
