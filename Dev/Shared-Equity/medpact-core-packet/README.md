medpact-core-packet

This folder holds the medpact core packet files. Place `medpact-core-packet.zip` here and follow the instructions in `MEDPACT_CORE_PACKET_UPLOAD.md` to extract it.

Quick actions

Windows (PowerShell):
```powershell
cd "C:\\Dev\\Shared-Equity\\medpact-core-packet"
Expand-Archive -Path .\\medpact-core-packet.zip -DestinationPath . -Force
```

macOS / Linux (bash):
```bash
cd /path/to/C/Dev/Shared-Equity/medpact-core-packet
unzip -o medpact-core-packet.zip -d .
```

Create a zip from the folder

Windows (PowerShell):
```powershell
cd "C:\\Dev\\Shared-Equity\\medpact-core-packet"
Compress-Archive -Path * -DestinationPath ..\\medpact-core-packet.zip -Force
```

macOS / Linux (bash):
```bash
cd /path/to/C/Dev/Shared-Equity/medpact-core-packet
zip -r ../medpact-core-packet.zip .
```

If you'd like, upload or move `medpact-core-packet.zip` into this folder and reply "extract" — I'll extract it for you and list the files.
