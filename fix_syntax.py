import os
import glob
import re

directory = r'c:\Users\SYS5\Desktop\SanCars\frontend\src'
files = glob.glob(directory + '/**/*.jsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Replace normal string:
    content = re.sub(r"'http://localhost:8000(.*?)'", r"`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}\1`", content)
    # Replace template literal string:
    content = content.replace("`http://localhost:8000", "`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}")
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file}")
