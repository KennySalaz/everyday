import os
import re

files = [
    'src/pages/Pricing.css',
    'src/pages/Dashboard/Sidebar.css',
    'src/pages/Dashboard/DashboardLayout.css',
    'src/pages/Pricing.jsx'
]

replacements = [
    (re.compile(r'#4318FF', re.IGNORECASE), r'var(--color-accent)'),
    (re.compile(r'#2b3674', re.IGNORECASE), r'var(--color-primary)'),
    (re.compile(r'#a3aed1', re.IGNORECASE), r'var(--color-text-light)'),
    (re.compile(r'#f4f7fe', re.IGNORECASE), r'var(--color-background-off)'),
    (re.compile(r'rgba\(67,\s*24,\s*255,\s*([0-9.]+)\)', re.IGNORECASE), r'rgba(212, 175, 55, \1)'),
    (re.compile(r'linear-gradient\(135deg,\s*var\(--color-accent\)\s*0%,\s*#868CFF\s*100%\)', re.IGNORECASE), r'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)'),
    (re.compile(r'linear-gradient\(135deg,\s*#4318FF\s*0%,\s*#868CFF\s*100%\)', re.IGNORECASE), r'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)')
]

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    for pattern, repl in replacements:
        content = pattern.sub(repl, content)
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Colors updated.")
