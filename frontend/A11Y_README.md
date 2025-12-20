# Zali Accessibility Documentation

Welcome to Zali's comprehensive accessibility documentation. This guide helps developers, QA, and designers ensure the application meets WCAG 2.1 Level AA standards.

## Quick Start

**New to accessibility?** Start here:
1. Read the [Accessibility Overview](./ACCESSIBILITY.md)
2. Review [ARIA Patterns](./ARIA_PATTERNS.md) for common patterns
3. Check [Component Accessibility](./COMPONENT_ACCESSIBILITY.md) for your component

**Implementing a feature?**
1. Use the [Accessibility Checklist](./ACCESSIBILITY_CHECKLIST.md)
2. Reference [ARIA Patterns](./ARIA_PATTERNS.md) for implementation
3. Test using [Accessibility Testing Guide](./ACCESSIBILITY_TESTING.md)

**Found an accessibility issue?**
1. Document it clearly
2. Run tests from [Testing Guide](./ACCESSIBILITY_TESTING.md)
3. Check [Common Issues](./ACCESSIBILITY.md#common-issues-and-solutions)

## Documentation Structure

### 📖 Guides

| Document | Purpose | Audience |
|----------|---------|----------|
| **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** | Complete accessibility overview | Everyone |
| **[ARIA_PATTERNS.md](./ARIA_PATTERNS.md)** | Common ARIA patterns with examples | Developers |
| **[ACCESSIBILITY_CHECKLIST.md](./ACCESSIBILITY_CHECKLIST.md)** | Pre/post development checklist | Developers |
| **[ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md)** | How to test for accessibility | QA/Testers |
| **[COMPONENT_ACCESSIBILITY.md](./COMPONENT_ACCESSIBILITY.md)** | Component-specific requirements | Developers |

### 🛠️ Utilities

| File | Purpose |
|------|---------|
| **[src/utils/accessibility.ts](./src/utils/accessibility.ts)** | Helper functions for accessibility |

### 🧪 Tests

| File | Purpose |
|------|---------|
| **[src/components/__tests__/accessibility.test.tsx](./src/components/__tests__/accessibility.test.tsx)** | Automated accessibility tests |

## Key Features Implemented

### ✅ Keyboard Navigation
- Tab through all interactive elements
- Skip navigation link for keyboard users
- Mobile menu controls with Escape key
- No keyboard traps
- Logical tab order

### ✅ Screen Reader Support
- Semantic HTML (button, link, form, list, etc.)
- Proper ARIA labels and descriptions
- Form field associations
- Dynamic content announcements
- Landmark navigation

### ✅ Visual Accessibility
- Focus indicators on all interactive elements
- Color contrast ≥ 4.5:1
- Icons marked as decorative when needed
- Proper heading hierarchy
- Clear error messages

### ✅ Form Accessibility
- Labels for all form fields
- Fieldset/legend for form groups
- Clear error messages with aria-describedby
- Real-time validation feedback
- Required field indicators

## Quick Reference

### Common ARIA Attributes

```tsx
// Icon button needs label
<button aria-label="Delete">🗑️</button>

// Form field with error
<input aria-invalid={hasError} aria-describedby="error" />
<p id="error" role="alert">{errorMessage}</p>

// Status message
<div role="status" aria-live="polite">{message}</div>

// Decorative element
<div aria-hidden="true">✨</div>

// Toggle button
<button aria-pressed={isActive}>{text}</button>
```

### Testing Shortcuts

**Keyboard Test**:
```bash
# Navigate with Tab key, verify all elements reachable
Tab → Shift+Tab → Enter/Space → Escape
```

**Screen Reader** (NVDA):
```bash
# Navigate by heading
H → Jump to next heading
# Navigate by landmark
D → Jump to next landmark
# Read page
Insert+Down → Read all content
```

**Automated Test**:
```bash
npm test -- accessibility.test.tsx
```

**Lighthouse Audit**:
```bash
# Chrome DevTools > Lighthouse > Accessibility
# Target: 90+ score
```

## Accessibility Standards

- **Standard**: WCAG 2.1 Level AA
- **Target**: 100% compliance
- **Regular Testing**: Each PR
- **Automated Checks**: jest-axe in tests
- **Manual Review**: Keyboard & screen reader

## Component Checklist

Each component should have:

- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ ARIA attributes
- ✅ Proper labels
- ✅ Color contrast
- ✅ Tests
- ✅ Documentation

## Common Issues & Solutions

### Issue: Button not focusable
**Solution**: Use `<button>` element, not `<div role="button">`

### Issue: Form field unlabeled
**Solution**: Use `<label htmlFor="id">` or `aria-label`

### Issue: Focus not visible
**Solution**: Add `focus:outline-none focus:ring-2 focus:ring-{color}`

### Issue: Screen reader ignores content
**Solution**: Check if element has `aria-hidden="true"`

### Issue: Poor color contrast
**Solution**: Use WebAIM Contrast Checker, aim for 4.5:1 ratio

See [ACCESSIBILITY.md](./ACCESSIBILITY.md#common-issues-and-solutions) for more solutions.

## Tools Used

### Automated Testing
- **jest-axe**: Accessibility violation detection
- **Lighthouse**: Overall accessibility score
- **ESLint jsx-a11y**: Static code analysis

### Manual Testing
- **NVDA**: Free screen reader (Windows)
- **JAWS**: Commercial screen reader (Windows)
- **VoiceOver**: Built-in screen reader (Mac/iOS)

### Validation
- **WebAIM Contrast Checker**: Color contrast verification
- **Chrome DevTools**: Accessibility tree inspection
- **WAVE**: Visual accessibility feedback

## Development Workflow

### 1. Plan
- [ ] Review [Accessibility Checklist](./ACCESSIBILITY_CHECKLIST.md)
- [ ] Identify ARIA needs
- [ ] Plan keyboard navigation

### 2. Implement
- [ ] Use semantic HTML
- [ ] Add ARIA attributes
- [ ] Add focus indicators
- [ ] Implement keyboard navigation

### 3. Test
- [ ] Run automated tests
- [ ] Keyboard navigation test
- [ ] Screen reader test
- [ ] Color contrast check

### 4. Review
- [ ] Accessibility review
- [ ] Documentation review
- [ ] Final testing

## Testing Requirements

### Before PR Merge

```
[ ] jest-axe passes
[ ] Keyboard navigation works
[ ] Screen reader spot check
[ ] Contrast ratio verified
[ ] Focus indicators visible
```

### Before Release

```
[ ] Full keyboard test
[ ] Full screen reader test (≥2)
[ ] Lighthouse ≥90 score
[ ] All automated tools pass
[ ] Manual accessibility audit
```

## Contributing

When contributing to Zali:

1. Follow this accessibility guide
2. Use patterns from [ARIA_PATTERNS.md](./ARIA_PATTERNS.md)
3. Check [Component Accessibility](./COMPONENT_ACCESSIBILITY.md)
4. Use [Accessibility Checklist](./ACCESSIBILITY_CHECKLIST.md)
5. Test with [Testing Guide](./ACCESSIBILITY_TESTING.md)
6. Update documentation as needed

## Questions?

1. **"How do I..."** → Check [ACCESSIBILITY.md](./ACCESSIBILITY.md)
2. **"Show me an example"** → See [ARIA_PATTERNS.md](./ARIA_PATTERNS.md)
3. **"How do I test..."** → Use [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md)
4. **"What about component X?"** → Check [COMPONENT_ACCESSIBILITY.md](./COMPONENT_ACCESSIBILITY.md)
5. **Still stuck?** → Review WCAG 2.1 or ask the team

## Resources

### Official Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Learning Resources
- [WebAIM Articles](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [The A11Y Project](https://www.a11yproject.com/)

### Tools
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [Lighthouse Audit](https://developers.google.com/web/tools/lighthouse)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Summary

Zali is committed to accessibility. Every feature should be:
- **Keyboard navigable**
- **Screen reader compatible**
- **Visually clear**
- **Properly tested**

Use these guides to implement and verify accessibility in your contributions.

---

**Last Updated**: December 2025  
**Maintained By**: Development Team  
**Status**: Active - WCAG 2.1 Level AA Compliant
