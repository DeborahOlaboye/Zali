# Dark Mode Testing Guide

## Testing Checklist

### Visual Testing

- [ ] All text is readable in both light and dark modes
- [ ] Sufficient contrast ratios (WCAG AA minimum 4.5:1)
- [ ] No pure black (#000) or pure white (#fff) backgrounds
- [ ] Borders and dividers are visible in both modes
- [ ] Icons are clearly visible in both modes
- [ ] Hover and focus states work in both modes
- [ ] Images have proper backgrounds or borders
- [ ] Loading states are visible in both modes
- [ ] Error messages are clearly visible
- [ ] Success messages stand out appropriately

### Functional Testing

- [ ] Theme persists after page reload
- [ ] System preference detection works correctly
- [ ] Theme toggle cycles through all three modes
- [ ] No flash of unstyled content (FOUC)
- [ ] Theme changes are smooth (transitions)
- [ ] Mobile and desktop views both work
- [ ] All interactive elements remain functional

### Accessibility Testing

- [ ] Screen reader announces theme changes
- [ ] Theme toggle has proper aria-labels
- [ ] Keyboard navigation works in both modes
- [ ] Focus indicators are visible in both modes
- [ ] Color is not the only means of conveying information
- [ ] High contrast mode compatibility

### Browser Testing

Test in:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Automated Testing

### Unit Tests

```typescript
describe('ThemeContext', () => {
  it('should default to system theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setTheme('dark');
    });
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should apply dark class to html element', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setTheme('dark');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
```

### E2E Tests

```typescript
describe('Dark Mode', () => {
  it('should toggle theme via button', () => {
    cy.visit('/');
    cy.get('[aria-label*="Current theme"]').click();
    cy.get('html').should('have.class', 'dark');
  });

  it('should persist theme selection', () => {
    cy.visit('/');
    cy.get('[aria-label*="Current theme"]').click();
    cy.reload();
    cy.get('html').should('have.class', 'dark');
  });

  it('should respect system preference', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'matchMedia')
          .withArgs('(prefers-color-scheme: dark)')
          .returns({
            matches: true,
            addEventListener: cy.stub(),
            removeEventListener: cy.stub(),
          });
      },
    });
    cy.get('html').should('have.class', 'dark');
  });
});
```

## Manual Testing Procedure

1. **Initial Load**
   - Visit the site in incognito mode
   - Verify system theme is detected correctly
   - Check for any FOUC

2. **Theme Toggle**
   - Click theme toggle button
   - Verify smooth transition
   - Verify correct icon displays
   - Check localStorage is updated

3. **Persistence**
   - Set theme to dark
   - Refresh page
   - Verify theme persists
   - Clear localStorage
   - Verify returns to system default

4. **System Preference**
   - Set theme to "system"
   - Change OS theme
   - Verify app theme updates

5. **Component Testing**
   - Navigate to all pages
   - Verify all components render correctly
   - Check for any layout issues
   - Test all interactive elements

## Contrast Ratio Testing

Use browser DevTools or online tools:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools (Lighthouse)
- Firefox Accessibility Inspector

Minimum ratios:
- **Normal text**: 4.5:1 (WCAG AA)
- **Large text**: 3:1 (WCAG AA)
- **UI components**: 3:1

## Common Issues

### Flash of Wrong Theme
**Problem**: Theme flickers on page load
**Solution**: Ensure theme is applied before hydration

### Contrast Too Low
**Problem**: Text hard to read in one mode
**Solution**: Adjust color values in globals.css

### Icons Not Visible
**Problem**: Icons blend into background
**Solution**: Add explicit dark mode styles or use CSS variables

### Inconsistent Styles
**Problem**: Some components don't update
**Solution**: Ensure all components use theme-aware classes

## Performance Testing

- Measure theme switch time (should be <100ms)
- Check for layout shifts
- Verify no memory leaks from event listeners
- Test with React DevTools Profiler

## Reporting Issues

When reporting dark mode issues, include:
1. Theme mode (light/dark/system)
2. Browser and version
3. Operating system
4. Screenshot if visual issue
5. Steps to reproduce
6. Expected vs actual behavior
