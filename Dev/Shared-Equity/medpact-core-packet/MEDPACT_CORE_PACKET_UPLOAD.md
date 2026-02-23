MEDPACT CORE PACKET - Upload & Extract

1) Place `medpact-core-packet.zip` in this folder: `$(pwd)/medpact-core-packet`.

2) Extract (Windows PowerShell):
```powershell
cd "$(pwd)/medpact-core-packet"
Expand-Archive -Path .\\medpact-core-packet.zip -DestinationPath . -Force
```

3) Extract (macOS / Linux):
```bash
cd $(pwd)/medpact-core-packet
unzip -o medpact-core-packet.zip -d .
```

4) Verify contents:
```powershell
# Windows
Get-ChildItem -Recurse | Select-Object FullName, Length

# macOS/Linux
ls -la
```

If you want me to extract the zip here, upload or move it into this folder and reply `extract`.
