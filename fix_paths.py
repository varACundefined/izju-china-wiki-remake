#!/usr/bin/env python3
"""
Fix image paths and internal links in extracted HTML files.
Replace /static/_downloaded/... with /assets/images/...
Update internal page links to wiki-remake structure.
"""

import os
import re
from pathlib import Path

def fix_html_file(file_path):
    """Fix image paths and links in a single HTML file."""
    
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  ❌ Error reading file: {e}")
        return False
    
    original_content = content
    changes = []
    
    # Fix image paths: /static/_downloaded/static.igem.wiki/teams/5913/... → /assets/images/...
    pattern1 = r'/static/_downloaded/static\.igem\.wiki/teams/5913/'
    replacement1 = '/assets/images/'
    new_content = re.sub(pattern1, replacement1, content)
    if new_content != content:
        count = len(re.findall(pattern1, content))
        changes.append(f"Updated {count} image paths")
        content = new_content
    
    # Fix other static paths
    pattern2 = r'href="static/'
    replacement2 = 'href="/assets/'
    new_content = re.sub(pattern2, replacement2, content)
    if new_content != content:
        count = len(re.findall(pattern2, content))
        changes.append(f"Updated {count} static CSS links")
        content = new_content
    
    # Fix internal links (basic mapping)
    link_mappings = {
        r'href="background"': 'href="/pages/1Project/background.html"',
        r'href="description"': 'href="/pages/1Project/description.html"',
        r'href="engineering"': 'href="/pages/1Project/engineering.html"',
        r'href="contribution"': 'href="/pages/1Project/contribution.html"',
        r'href="implementation"': 'href="/pages/1Project/implementation.html"',
        r'href="project-future"': 'href="/pages/1Project/project-future.html"',
        r'href="design"': 'href="/pages/2Dry Lab/design.html"',
        r'href="model"': 'href="/pages/2Dry Lab/model.html"',
        r'href="wetlab-overview"': 'href="/pages/3Wet Lab/wetlab-overview.html"',
        r'href="gene-cleavage"': 'href="/pages/3Wet Lab/gene-cleavage.html"',
        r'href="assembly"': 'href="/pages/3Wet Lab/assembly.html"',
        r'href="validation"': 'href="/pages/3Wet Lab/validation.html"',
        r'href="wetlab-future"': 'href="/pages/3Wet Lab/wetlab-future.html"',
        r'href="parts"': 'href="/pages/3Wet Lab/parts.html"',
        r'href="human-practices"': 'href="/pages/4Human Practice/human-practices.html"',
        r'href="entrepreneurship"': 'href="/pages/4Human Practice/entrepreneurship.html"',
        r'href="collaborations"': 'href="/pages/4Human Practice/collaborations.html"',
        r'href="safety"': 'href="/pages/4Human Practice/safety.html"',
        r'href="roster"': 'href="/pages/5Team/roster.html"',
        r'href="attributions"': 'href="/pages/5Team/attributions.html"',
        r'href="awards"': 'href="/pages/5Team/awards.html"',
    }
    
    link_changes = 0
    for pattern, replacement in link_mappings.items():
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            link_changes += 1
            content = new_content
    
    if link_changes > 0:
        changes.append(f"Updated {link_changes} internal links")
    
    # Save if there were changes
    if content != original_content:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ Fixed: {', '.join(changes)}")
            return True
        except Exception as e:
            print(f"  ❌ Error writing file: {e}")
            return False
    else:
        print(f"  ℹ️  No changes needed")
        return None


def main():
    """Process all HTML files in the pages directory."""
    
    base_dir = Path('d:/igem/wiki-remake/public/pages')
    
    print("=" * 80)
    print("Fixing Image Paths and Internal Links")
    print("=" * 80)
    print()
    
    stats = {
        'total': 0,
        'fixed': 0,
        'unchanged': 0,
        'errors': 0
    }
    
    # Find all HTML files
    html_files = list(base_dir.rglob('*.html'))
    
    for html_file in html_files:
        stats['total'] += 1
        result = fix_html_file(html_file)
        
        if result is True:
            stats['fixed'] += 1
        elif result is None:
            stats['unchanged'] += 1
        else:
            stats['errors'] += 1
    
    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total files: {stats['total']}")
    print(f"  ✅ Fixed: {stats['fixed']}")
    print(f"  ℹ️  Unchanged: {stats['unchanged']}")
    print(f"  ❌ Errors: {stats['errors']}")
    print()
    print("✨ Done!")
    print("=" * 80)


if __name__ == '__main__':
    main()
