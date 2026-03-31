#!/usr/bin/env python3
"""
Audit existing codebases for reusable components
"""
import os
import re
from pathlib import Path
from collections import defaultdict

REUSABLE_PATTERNS = {
    'auth': ['auth', 'login', 'session', 'jwt', 'oauth', 'mfa', 'sso'],
    'hipaa': ['audit', 'encrypt', 'phi', 'hipaa', 'compliance', 'logging'],
    'testing': ['test_', '_test', 'spec', 'pytest', 'jest', 'vitest'],
    'api': ['router', 'endpoint', 'crud', 'schema', 'model'],
    'ui': ['component', 'hook', 'context', 'provider'],
    'integration': ['ehr', 'emr', 'fhir', 'hl7', 'api_client'],
}

def scan_directory(base_path: str) -> dict:
    """Scan directory for reusable components"""
    results = defaultdict(list)
    
    for root, dirs, files in os.walk(base_path):
        # Skip node_modules, venv, etc.
        dirs[:] = [d for d in dirs if d not in ['node_modules', 'venv', '.git', '__pycache__', 'dist', 'build']]
        
        for file in files:
            if file.endswith(('.py', '.ts', '.tsx', '.js', '.jsx')):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, base_path)
                
                # Check filename and content for patterns
                file_lower = file.lower()
                for category, patterns in REUSABLE_PATTERNS.items():
                    for pattern in patterns:
                        if pattern in file_lower:
                            results[category].append({
                                'file': rel_path,
                                'pattern': pattern,
                                'type': 'filename'
                            })
                            break
                
                # Quick content scan for larger patterns
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()[:5000]  # First 5KB
                        for category, patterns in REUSABLE_PATTERNS.items():
                            for pattern in patterns:
                                if re.search(rf'\b{pattern}\b', content, re.IGNORECASE):
                                    if not any(r['file'] == rel_path for r in results[category]):
                                        results[category].append({
                                            'file': rel_path,
                                            'pattern': pattern,
                                            'type': 'content'
                                        })
                except Exception:
                    pass
    
    return results

def main():
    projects = [
        '/Users/christopherwilliams/Projects/onpaceplus',
        '/Users/christopherwilliams/Projects/medpact-practice-intelligence',
    ]
    
    print("=" * 60)
    print("MEDPACT CODEBASE AUDIT - REUSABLE COMPONENTS")
    print("=" * 60)
    
    for project in projects:
        if os.path.exists(project):
            print(f"\n📁 Scanning: {project}")
            print("-" * 40)
            results = scan_directory(project)
            
            for category, files in sorted(results.items()):
                if files:
                    print(f"\n  🏷️  {category.upper()} ({len(files)} files)")
                    for item in files[:5]:  # Show first 5
                        print(f"      - {item['file']}")
                    if len(files) > 5:
                        print(f"      ... and {len(files) - 5} more")
        else:
            print(f"\n⚠️  Not found: {project}")
    
    print("\n" + "=" * 60)

if __name__ == '__main__':
    main()

[
    {
        "type": "command",
        "details": {
            "key": "python.execInTerminal"
        }
    }
]