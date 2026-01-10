#!/usr/bin/env python3
"""
Extract main content from IZJU-China pages and prepare for wiki-remake integration.
"""

import os
import re
from pathlib import Path
import json

def extract_content_regex(html_content):
    """Extract content using regex - more reliable for this specific structure."""
    
    # Extract page title
    title_match = re.search(r'<title>([^|<]+)', html_content)
    page_title = title_match.group(1).strip() if title_match else "Untitled"
    
    # Find the main content div
    # Look for <div class="pagecontent" id="auto-page-content">
    content_match = re.search(
        r'<div class="pagecontent"[^>]*id="auto-page-content"[^>]*>(.*?)</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>',
        html_content,
        re.DOTALL
    )
    
    if not content_match:
        # Try alternative patterns
        content_match = re.search(
            r'id="auto-page-content"[^>]*>(.*?)</div>\s*</div>\s*</div>',
            html_content,
            re.DOTALL
        )
    
    if not content_match:
        return None, page_title
    
    content = content_match.group(1).strip()
    
    # Remove scripts
    content = re.sub(r'<script\b[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove style tags
    content = re.sub(r'<style\b[^>]*>.*?</style>', '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove comments
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    
    return content, page_title


# File mapping configuration
FILE_MAPPING = {
    '1Project': [
        'background', 'description', 'engineering', 'contribution', 
        'implementation', 'project-future'
    ],
    '2Dry Lab': [
        'design', 'model'
    ],
    '3Wet Lab': [
        'wetlab-overview', 'gene-cleavage', 'assembly', 'validation', 
        'wetlab-future', 'parts'
    ],
    '4Human Practice': [
        'human-practices', 'entrepreneurship', 'collaborations', 'safety'
    ],
    '5Team': [
        'roster', 'attributions', 'awards'
    ]
}

# HTML template for wiki-remake pages
HTML_TEMPLATE = '''<!doctype html>
<html lang="zh-CN">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta charset="utf-8">
  <title>{title}</title>
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <button class="sidebar-toggle" aria-label="切换导航" aria-expanded="false">☰</button>
  <aside class="sidebar">
    <a class="home" href="/"><img src="/assets/images/menu.webp" alt="主页"></a>
    <!-- Sidebar will be injected by inject-sidebar.js -->
  </aside>

  <main class="content">
{content}
  </main>

  <aside id="toc" class="toc"></aside>
  <script src="/assets/js/main.js"></script>
  <footer class="site-footer">
    <img src="/assets/images/logo6.webp" alt="页脚图片">
  </footer>
</body>
</html>
'''


def extract_and_save(source_file, target_dir, filename):
    """Extract content from source file and save to target location."""
    
    print(f"Processing: {source_file} -> {target_dir}/{filename}")
    
    # Read source file
    try:
        with open(source_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except Exception as e:
        return {'status': 'error', 'message': f'Failed to read source: {e}'}
    
    # Extract content using regex
    try:
        extracted_content, page_title = extract_content_regex(html_content)
    except Exception as e:
        return {'status': 'error', 'message': f'Failed to parse HTML: {e}'}
    
    if not extracted_content or not extracted_content.strip():
        return {'status': 'warning', 'message': 'No content extracted'}
    
    # Indent content for proper formatting
    indented_content = '\n'.join('    ' + line if line.strip() else '' 
                                   for line in extracted_content.split('\n'))
    
    # Generate final HTML
    final_html = HTML_TEMPLATE.format(
        title=page_title,
        content=indented_content
    )
    
    # Create target directory if needed
    target_path = Path(target_dir)
    target_path.mkdir(parents=True, exist_ok=True)
    
    # Save file
    output_file = target_path / filename
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_html)
    except Exception as e:
        return {'status': 'error', 'message': f'Failed to write output: {e}'}
    
    return {
        'status': 'success',
        'title': page_title,
        'output': str(output_file),
        'content_size': len(extracted_content)
    }


def main():
    """Main processing function."""
    
    source_dir = Path('d:/igem/izju-china/public')
    target_base = Path('d:/igem/wiki-remake/public/pages')
    
    results = []
    summary = {
        'success': 0,
        'warning': 0,
        'error': 0,
        'total': 0
    }
    
    print("=" * 80)
    print("IZJU-China Content Extraction")
    print("=" * 80)
    print()
    
    # Process each category
    for category, files in FILE_MAPPING.items():
        print(f"\n📁 Processing category: {category}")
        print("-" * 80)
        
        target_dir = target_base / category
        
        for source_name in files:
            source_file = source_dir / source_name
            
            # Generate output filename
            output_filename = f"{source_name}.html"
            
            if not source_file.exists():
                result = {
                    'source': source_name,
                    'category': category,
                    'status': 'error',
                    'message': 'Source file not found'
                }
                print(f"  ❌ {source_name}: File not found")
            else:
                result = extract_and_save(source_file, target_dir, output_filename)
                result['source'] = source_name
                result['category'] = category
                
                if result['status'] == 'success':
                    print(f"  ✅ {source_name} → {output_filename} ({result['content_size']} bytes)")
                elif result['status'] == 'warning':
                    print(f"  ⚠️  {source_name}: {result['message']}")
                else:
                    print(f"  ❌ {source_name}: {result['message']}")
            
            results.append(result)
            summary['total'] += 1
            summary[result['status']] += 1
    
    # Generate report
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total files processed: {summary['total']}")
    print(f"  ✅ Success: {summary['success']}")
    print(f"  ⚠️  Warning: {summary['warning']}")
    print(f"  ❌ Error: {summary['error']}")
    print()
    
    # Save detailed report
    report_file = target_base.parent / 'extraction_report.json'
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump({
            'summary': summary,
            'results': results
        }, f, indent=2, ensure_ascii=False)
    
    print(f"📄 Detailed report saved to: {report_file}")
    
    # List files needing manual review
    issues = [r for r in results if r['status'] in ['warning', 'error']]
    if issues:
        print("\n⚠️  Files needing manual review:")
        for issue in issues:
            print(f"  - {issue['source']} ({issue['category']}): {issue['message']}")
    
    print("\n" + "=" * 80)
    print("✨ Extraction complete!")
    print("=" * 80)


if __name__ == '__main__':
    main()
