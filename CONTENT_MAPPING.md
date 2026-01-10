# IZJU-China Content Extraction - Detailed Mapping Report

## 📋 Overview
Successfully extracted and migrated 21 pages from IZJU-China to wiki-remake structure.

**Extraction Date**: 2026-01-08  
**Success Rate**: 100% (21/21 files)  
**Total Content Extracted**: ~743 KB

---

## 📁 File Mapping

### 1Project (6 files)
| Source File | Target Location | Page Title | Content Size | Status |
|------------|----------------|------------|--------------|---------|
| `background` | `/pages/1Project/background.html` | Background | 14,199 bytes | ✅ |
| `description` | `/pages/1Project/description.html` | Description | 50,307 bytes | ✅ |
| `engineering` | `/pages/1Project/engineering.html` | Engineering | 90,238 bytes | ✅ |
| `contribution` | `/pages/1Project/contribution.html` | Contribution | 13,106 bytes | ✅ |
| `implementation` | `/pages/1Project/implementation.html` | Implementation | 10,446 bytes | ✅ |
| `project-future` | `/pages/1Project/project-future.html` | Future Directions | 17,132 bytes | ✅ |

**Subtotal**: 195,428 bytes

---

### 2Dry Lab (2 files)
| Source File | Target Location | Page Title | Content Size | Status |
|------------|----------------|------------|--------------|---------|
| `design` | `/pages/2Dry Lab/design.html` | Design | 32,159 bytes | ✅ |
| `model` | `/pages/2Dry Lab/model.html` | Model | 74,312 bytes | ✅ |

**Subtotal**: 106,471 bytes

---

### 3Wet Lab (6 files)
| Source File | Target Location | Page Title | Content Size | Status |
|------------|----------------|------------|--------------|---------|
| `wetlab-overview` | `/pages/3Wet Lab/wetlab-overview.html` | Wet Lab Overview | 8,605 bytes | ✅ |
| `gene-cleavage` | `/pages/3Wet Lab/gene-cleavage.html` | Gene Cleavage Module | 6,605 bytes | ✅ |
| `assembly` | `/pages/3Wet Lab/assembly.html` | Assembly Module | 42,238 bytes | ✅ |
| `validation` | `/pages/3Wet Lab/validation.html` | Functional Validation | 7,334 bytes | ✅ |
| `wetlab-future` | `/pages/3Wet Lab/wetlab-future.html` | Future Directions | 20,821 bytes | ✅ |
| `parts` | `/pages/3Wet Lab/parts.html` | Parts | 215,416 bytes | ✅ ⚠️ |

**Subtotal**: 301,019 bytes  
**Note**: `parts.html` is notably large (215 KB) - consider splitting if needed

---

### 4Human Practice (4 files)
| Source File | Target Location | Page Title | Content Size | Status |
|------------|----------------|------------|--------------|---------|
| `human-practices` | `/pages/4Human Practice/human-practices.html` | Human Practices | 73,055 bytes | ✅ |
| `entrepreneurship` | `/pages/4Human Practice/entrepreneurship.html` | Entrepreneurship | 30,545 bytes | ✅ |
| `collaborations` | `/pages/4Human Practice/collaborations.html` | Collaboration | 8,951 bytes | ✅ |
| `safety` | `/pages/4Human Practice/safety.html` | Safety | 17,729 bytes | ✅ |

**Subtotal**: 130,280 bytes

---

### 5Team (3 files)
| Source File | Target Location | Page Title | Content Size | Status |
|------------|----------------|------------|--------------|---------|
| `roster` | `/pages/5Team/roster.html` | Team Roster | 15,384 bytes | ✅ |
| `attributions` | `/pages/5Team/attributions.html` | Attributions | 730 bytes | ✅ ⚠️ |
| `awards` | `/pages/5Team/awards.html` | Awards | 4,329 bytes | ✅ |

**Subtotal**: 20,443 bytes  
**Note**: `attributions.html` is very small (730 bytes) - verify content completeness

---

## 🎯 What Was Extracted

### ✅ Content Preserved
- All heading structures (h1, h2, h3, etc.)
- Paragraph text with formatting (em, strong, etc.)
- Lists (ordered and unordered)
- Tables and figures
- Images (with alt text and source paths)
- Mathematical formulas (MathJax compatible)
- Inline styles affecting content display
- Custom content containers (div classes)

### ❌ Content Removed
- Navigation bars (`<nav>`, `.navbar`, `.my-nav`)
- Search boxes
- Sidebars (`.menubg`, `#menu`)
- Back-to-top buttons (`#global-back-to-top`)
- Footer sections (`<footer>`)
- All `<script>` tags
- All `<style>` tags
- HTML comments
- Loading animations

---

## 🔧 Generated HTML Structure

Each extracted page follows this template:

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta charset="utf-8">
  <title>[Page Title]</title>
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <button class="sidebar-toggle" aria-label="切换导航" aria-expanded="false">☰</button>
  <aside class="sidebar">
    <a class="home" href="/"><img src="/assets/images/menu.webp" alt="主页"></a>
    <!-- Sidebar will be injected by inject-sidebar.js -->
  </aside>

  <main class="content">
    [EXTRACTED CONTENT HERE]
  </main>

  <aside id="toc" class="toc"></aside>
  <script src="/assets/js/main.js"></script>
  <footer class="site-footer">
    <img src="/assets/images/logo6.webp" alt="页脚图片">
  </footer>
</body>
</html>
```

---

## ⚠️ Manual Review Recommendations

### High Priority
1. **Parts page** (`3Wet Lab/parts.html`): 215 KB - Verify rendering performance, consider pagination
2. **Attributions page** (`5Team/attributions.html`): Only 730 bytes - Verify content is complete
3. **Image paths**: All image URLs currently reference `/static/_downloaded/...` - Update to wiki-remake paths
4. **Internal links**: Links between pages still use old structure - need to update

### Medium Priority
1. **Engineering page**: 90 KB - Check if TOC generation works properly with many headings
2. **Human Practices page**: 73 KB - Large content, verify readability
3. **Model page**: 74 KB - May contain complex equations, verify MathJax rendering

### Low Priority (Verification)
- Check all mathematical formulas render correctly
- Verify all figures and images display properly
- Test responsive design on mobile devices
- Validate all tables format correctly

---

## 🔗 Known Issues & Next Steps

### Images & Assets
**Issue**: All image paths still point to IZJU-China structure:
```html
/static/_downloaded/static.igem.wiki/teams/5913/...
```

**Resolution Required**:
1. Copy images from `d:/igem/izju-china/public/static/_downloaded/` to `d:/igem/wiki-remake/public/assets/images/`
2. Run find-replace to update image paths in all HTML files
3. Alternative: Update image paths to relative references

### Internal Links
**Issue**: Cross-page links may still reference old URLs.

**Resolution Required**:
- Search for `href="..."` patterns
- Update to wiki-remake structure (`/pages/...`)

### External Stylesheets
**Issue**: Some pages reference external CSS files:
```html
<link rel="stylesheet" href="static/safety-typography.css">
```

**Resolution Required**:
- Either integrate these styles into main `styles.css`
- Or copy CSS files to wiki-remake and update paths

### MathJax Configuration
**Issue**: Original pages used MathJax but script is removed from extracted pages.

**Resolution Required**:
- Add MathJax library to wiki-remake if not already present
- Or add MathJax script to `main.js`

---

## 📊 Statistics Summary

| Category | Files | Total Size | Avg Size |
|----------|-------|------------|----------|
| 1Project | 6 | 195 KB | 32.6 KB |
| 2Dry Lab | 2 | 106 KB | 53.2 KB |
| 3Wet Lab | 6 | 301 KB | 50.2 KB |
| 4Human Practice | 4 | 130 KB | 32.6 KB |
| 5Team | 3 | 20 KB | 6.8 KB |
| **Total** | **21** | **~752 KB** | **35.8 KB** |

---

## 🎉 Success Metrics

- ✅ **100% extraction success rate** (21/21 files)
- ✅ **No parsing errors**
- ✅ **All page titles extracted correctly**
- ✅ **Content structure preserved**
- ✅ **Ready for wiki-remake integration**

---

## 📝 Next Actions Checklist

### Critical (Must Do)
- [ ] Update image paths in all HTML files
- [ ] Copy image assets from IZJU-China to wiki-remake
- [ ] Update internal page links
- [ ] Test TOC generation on all pages
- [ ] Run sidebar injection script to populate navigation

### Important (Should Do)
- [ ] Add MathJax support if not present
- [ ] Verify all mathematical formulas render correctly
- [ ] Review and split large pages if needed (parts.html)
- [ ] Verify attributions page content
- [ ] Test on mobile devices

### Nice to Have
- [ ] Add breadcrumb navigation
- [ ] Optimize large images
- [ ] Add page metadata
- [ ] Create index pages for each category
- [ ] Add print stylesheets

---

## 🛠️ Tools Used

- **Extraction Script**: `extract_content.py`
- **Method**: Regex-based HTML parsing
- **Pattern Matched**: `<div class="pagecontent" id="auto-page-content">`
- **Output Format**: Wiki-remake standard template

---

## 📂 File Locations

- **Source Directory**: `d:/igem/izju-china/public/`
- **Target Directory**: `d:/igem/wiki-remake/public/pages/`
- **Report Files**:
  - JSON Report: `d:/igem/wiki-remake/public/extraction_report.json`
  - This Document: `d:/igem/wiki-remake/CONTENT_MAPPING.md`

---

*Generated automatically by extract_content.py on 2026-01-08*
