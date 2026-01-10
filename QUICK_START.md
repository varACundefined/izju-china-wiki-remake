# 🚀 Quick Start Guide - IZJU-China Integration

## What We've Done ✅

All 21 pages have been successfully extracted from IZJU-China and prepared for wiki-remake:

- ✅ Content extracted and cleaned
- ✅ HTML templates applied
- ✅ Image paths updated (296 references)
- ✅ Internal links fixed (13 links)
- ✅ Ready for integration

## What You Need to Do Now 🎯

### Step 1: Copy Image Assets (REQUIRED)

Run this command to copy all images:

```powershell
Copy-Item -Path "D:/igem/izju-china/public/static/_downloaded/static.igem.wiki/teams/5913" -Destination "D:/igem/wiki-remake/public/assets/images" -Recurse -Force
```

This copies ~21 subdirectories of images including:
- aptamer, contribution, description, design
- model, safety, team-photo
- wet-future, wet-overview, wet-protocol, wet-result
- And more...

### Step 2: Inject Sidebar Navigation

```powershell
cd D:\igem\wiki-remake
node inject-sidebar.js
```

This will populate the sidebar navigation in all HTML files.

### Step 3: Start the Server

```powershell
node server.js
```

Then open your browser to: **http://localhost:3000**

### Step 4: Test Your Pages

Navigate to each category and verify:
- ✅ Images load correctly
- ✅ Internal links work
- ✅ TOC generates properly
- ✅ Content displays as expected

---

## 📂 Where to Find Your New Pages

All extracted pages are in: `d:/igem/wiki-remake/public/pages/`

### Directory Structure:
```
public/pages/
├── 1Project/
│   ├── background.html
│   ├── description.html
│   ├── engineering.html
│   ├── contribution.html
│   ├── implementation.html
│   └── project-future.html
├── 2Dry Lab/
│   ├── design.html
│   └── model.html
├── 3Wet Lab/
│   ├── wetlab-overview.html
│   ├── gene-cleavage.html
│   ├── assembly.html
│   ├── validation.html
│   ├── wetlab-future.html
│   └── parts.html
├── 4Human Practice/
│   ├── human-practices.html
│   ├── entrepreneurship.html
│   ├── collaborations.html
│   └── safety.html
└── 5Team/
    ├── roster.html
    ├── attributions.html
    └── awards.html
```

---

## ⚠️ Known Issues to Check

1. **Attributions Page** (`5Team/attributions.html`)  
   - Only 730 bytes - verify content is complete

2. **Large Parts Page** (`3Wet Lab/parts.html`)  
   - 215 KB - check loading performance

3. **MathJax Formulas**  
   - Verify mathematical equations render correctly

---

## 📚 Documentation Files

- **EXTRACTION_SUMMARY.md** - This quick start guide
- **CONTENT_MAPPING.md** - Detailed file mapping and technical details
- **extraction_report.json** - Machine-readable extraction report

---

## 🆘 Troubleshooting

### Images Not Loading?
Make sure you ran Step 1 to copy the image assets.

### Sidebar Not Showing?
Run `node inject-sidebar.js` (Step 2).

### TOC Not Generating?
Check that `main.js` is loading correctly and TOC generation code is active.

### Internal Links Broken?
All links have been updated to wiki-remake structure. If some are still broken, report which ones.

---

## ✨ You're All Set!

Once you complete Steps 1-3, your IZJU-China content will be fully integrated into wiki-remake and ready to view!

**Estimated Time**: 2-3 minutes to complete all steps.

---

*Generated: 2026-01-08*
