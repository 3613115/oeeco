$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$node = "C:\Users\xzliy\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
Set-Location $root
& $node "$root\node_modules\next\dist\bin\next" dev -H 127.0.0.1 -p 3000
