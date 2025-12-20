# Accessibility Testing Guide

Comprehensive guide for testing Zali's accessibility features.

## Automated Testing

### Jest with jest-axe

Run automated accessibility tests:

```bash
npm test -- accessibility.test.tsx
```

Tests verify:
- No axe violations
- Proper semantic HTML
- ARIA attributes present
- Focus management
- Heading hierarchy

### Lighthouse Accessibility Audit

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Run Accessibility audit
4. Fix reported issues
5. Aim for 90+ score

### Automated Tools

- **Axe DevTools**: Browser extension for accessibility checks
- **WAVE**: WebAIM tool for visual feedback
- **Lighthouse**: Built into Chrome DevTools
- **ESLint jsx-a11y**: Static analysis for code

## Manual Keyboard Testing

### Tab Navigation

1. Press `Tab` to navigate forward
2. Press `Shift+Tab` to navigate backward
3. Verify:
   - All interactive elements reachable
   - No keyboard traps
   - Focus moves in logical order
   - Focus indicator visible

### Common Interactions

- **Buttons**: Press `Enter` or `Space`
- **Links**: Press `Enter`
- **Menus**: Use `Arrow` keys, `Escape` to close
- **Forms**: `Tab` between fields, `Tab` to submit
- **Dialogs**: `Tab` within dialog, `Escape` to close

### Test Checklist

```
[ ] Home page
    [ ] Tab through nav
    [ ] Focus visible on all buttons
    [ ] CTA buttons clickable
    [ ] Escape closes any modals

[ ] Play page
    [ ] Question visible
    [ ] All options clickable with keyboard
    [ ] Score updates announced
    [ ] Results screen accessible

[ ] Leaderboard
    [ ] List navigable
    [ ] Rankings clear
    [ ] Your rank highlighted
    [ ] Scores readable

[ ] Forms (Register/Sign In)
    [ ] Fields labeled
    [ ] Error messages readable
    [ ] Submit button reachable
    [ ] Validation feedback clear
```

## Screen Reader Testing

### NVDA (Windows)

**Installation**:
```bash
# Download from https://www.nvaccess.org/
```

**Basic Commands**:
- `Insert+Arrow Down`: Read full page
- `Insert+Arrow Up`: Speak previous
- `H`: Jump to next heading
- `D`: Jump to landmark
- `L`: Jump to list
- `T`: Jump to table
- `F`: Jump to form field
- `B`: Jump to button

**Testing**:
1. Start NVDA
2. Navigate with NVDA commands
3. Verify all content readable
4. Check button purpose clear
5. Verify form labels announced

### JAWS (Windows)

Similar to NVDA. Key commands:
- `Insert+H`: Jump to heading
- `Insert+F3`: Open find dialog
- `Insert+F5`: List landmarks
- `T`: Table navigation
- `F`: Form field navigation

### VoiceOver (Mac/iOS)

**Mac**:
- `Cmd+F5`: Enable VoiceOver
- `VO+Right Arrow`: Next item
- `VO+Left Arrow`: Previous item
- `VO+U`: Open rotor
- `VO+Space`: Activate

**iOS**:
- Settings > Accessibility > VoiceOver
- Swipe right: Next element
- Swipe left: Previous element
- Double-tap: Activate

### Screen Reader Test Plan

```
[ ] Page Structure
    [ ] Page title announced
    [ ] Landmarks identified
    [ ] Headings in order
    [ ] Navigation clear

[ ] Content
    [ ] All text readable
    [ ] Images described
    [ ] Links have purpose
    [ ] Lists announced

[ ] Forms
    [ ] Labels announced
    [ ] Required fields indicated
    [ ] Error messages clear
    [ ] Form type identified

[ ] Interactions
    [ ] Buttons announced
    [ ] State changes announced
    [ ] Loading announced
    [ ] Results announced
```

## Color Contrast Testing

### Tools

- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Chrome DevTools**: Highlight element, check accessibility panel
- **Color Blindness Simulator**: https://www.color-blindness.com/coblis-color-blindness-simulator/

### Test Steps

1. Identify text/background color
2. Use WebAIM Checker
3. Verify ratio ≥ 4.5:1 (normal) or 3:1 (large)
4. Check with color blindness simulator
5. Verify non-text elements have 3:1 ratio

### Common Issues

- Gray text on light background: Too low contrast
- White text on yellow: May fail
- Icons on similar color background: Insufficient contrast
- Links without underline: May not meet contrast

## Visual Testing

### Zoom and Scaling

1. Set zoom to 200%
2. Verify:
   - Content still readable
   - No horizontal scrolling
   - Layout doesn't break
   - Focus visible

### Mobile/Responsive

1. Test on actual mobile device
2. Verify:
   - Touch targets ≥ 44x44px
   - Content reflows
   - Text readable without zoom
   - Form inputs accessible

### Motion and Animation

1. Enable "Reduce Motion" in OS settings
2. Verify:
   - Animations stopped or slow
   - Content still accessible
   - No animation traps

## Form Accessibility Testing

### Test Each Form

1. **Labels**:
   - All inputs have labels
   - Labels associated with `htmlFor`
   - Labels visible

2. **Validation**:
   - Errors clearly indicated
   - Error messages associated
   - Recovery instructions provided

3. **Required Fields**:
   - Indicated visually
   - Announced by screen reader
   - * or "required" text

4. **Input Types**:
   - Correct type used
   - Mobile keyboard appropriate
   - Autocomplete helpful

5. **Submission**:
   - Submit button clear
   - Confirmation provided
   - Success message announced

## Browser DevTools

### Chrome DevTools

1. Open DevTools
2. Go to **Elements** tab
3. Right-click element
4. **Inspect Accessibility Properties**
5. Check:
   - Computed Name
   - Computed Role
   - Accessibility Tree

### Firefox DevTools

1. Open DevTools
2. Go to **Inspector**
3. Click **Accessibility**
4. Check:
   - Name
   - Role
   - Outline
   - Keyboard Navigation

## Testing in CI/CD

### Pre-commit

```bash
npm run test:a11y
```

### Pre-deployment

```bash
npm run build
npm run lighthouse
```

## Accessibility Audit Report Template

Use this template to document accessibility testing:

```markdown
# Accessibility Test Report

**Date**: YYYY-MM-DD
**Tester**: Name
**Component**: Component Name

## Automated Testing
- [ ] Axe: PASS/FAIL
- [ ] Lighthouse: Score ___/100
- [ ] ESLint: PASS/FAIL

## Manual Testing

### Keyboard Navigation
- [ ] All elements reachable
- [ ] No traps
- [ ] Focus visible
- [ ] Logical order

### Screen Reader
- [x] NVDA: PASS/FAIL
- [ ] JAWS: PASS/FAIL
- [ ] VoiceOver: PASS/FAIL

### Color Contrast
- [ ] Text: ✓ WCAG AA
- [ ] Graphics: ✓ WCAG AA

### Issues Found
1. Issue 1
2. Issue 2

### Recommendations
1. Recommendation 1
2. Recommendation 2

## Conclusion
PASS/FAIL - Overall accessibility status
```

## Quick Testing Checklist

**Before Merging PR**:
- [ ] Run jest-axe tests
- [ ] Manual keyboard test
- [ ] Screen reader spot check
- [ ] Contrast ratio check
- [ ] Mobile responsive test

**Before Release**:
- [ ] Full keyboard test
- [ ] Full screen reader test (≥2)
- [ ] Lighthouse audit (≥90)
- [ ] All tools check
- [ ] Accessibility audit

## Common Testing Mistakes

❌ Testing only with one screen reader
❌ Only testing happy path
❌ Ignoring error states
❌ Testing at default zoom only
❌ Not testing with actual disabilities
❌ Assuming automation finds everything
❌ Not testing on real devices

## Resources

- [WebAIM Testing](https://webaim.org/articles/)
- [WCAG 2.1 Test Procedures](https://www.w3.org/WAI/test-evaluate/)
- [Accessibility Testing Tools](https://www.a11yproject.com/resources/)
- [Screen Reader Testing Guide](https://www.nvaccess.org/)

## Continuous Testing

- Set up automated tests in CI/CD
- Run accessibility audit on each PR
- Schedule monthly manual testing
- Update tests when issues found
- Review and update this guide regularly
