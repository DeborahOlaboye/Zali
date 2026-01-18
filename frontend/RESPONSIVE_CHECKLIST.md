# Mobile Responsiveness Checklist

Use this checklist to ensure your components and pages are fully responsive.

## 📱 Mobile Optimization

- [ ] Component works on screens as small as 320px wide
- [ ] Touch targets are at least 44x44 pixels
- [ ] Text is readable at mobile sizes (minimum 16px for inputs)
- [ ] Images are optimized and responsive
- [ ] Forms use appropriate mobile input types
- [ ] No horizontal scrolling on mobile devices
- [ ] Content is accessible without pinch-to-zoom

## 📊 Breakpoints

- [ ] Tested on mobile (320px - 768px)
- [ ] Tested on tablet (769px - 1024px)
- [ ] Tested on desktop (1025px+)
- [ ] Works in both portrait and landscape orientations
- [ ] Transitions smoothly between breakpoints

## 🎨 Layout

- [ ] Uses responsive containers and grids
- [ ] Adapts layout for different screen sizes
- [ ] Properly stacks elements on mobile
- [ ] Maintains proper spacing on all devices
- [ ] Navigation is accessible on all devices

## 🔤 Typography

- [ ] Font sizes are responsive
- [ ] Line height is appropriate for mobile
- [ ] Text doesn't overflow containers
- [ ] Headings scale appropriately
- [ ] Long text can be truncated when needed

## 🖱️ Interactions

- [ ] Buttons are touch-friendly
- [ ] Hover states work on desktop
- [ ] Touch feedback on mobile
- [ ] Smooth animations on all devices
- [ ] No input zoom on iOS

## 🖼️ Media

- [ ] Images use responsive sizing
- [ ] Videos are responsive
- [ ] Icons scale appropriately
- [ ] Lazy loading for images below fold
- [ ] Proper aspect ratios maintained

## 📋 Forms

- [ ] Form fields are properly sized for mobile
- [ ] Appropriate keyboard types on mobile
- [ ] Error messages are visible
- [ ] Submit buttons are accessible
- [ ] Form validation works on all devices

## 📊 Tables

- [ ] Tables have horizontal scroll or card view on mobile
- [ ] Headers are properly labeled
- [ ] Data is readable on small screens
- [ ] Pagination works on mobile

## 🎯 Accessibility

- [ ] Touch targets meet WCAG standards
- [ ] Color contrast is sufficient
- [ ] Screen reader friendly
- [ ] Keyboard navigation works
- [ ] ARIA labels are present

## 🚀 Performance

- [ ] No layout shift on mobile
- [ ] Fast loading on 3G networks
- [ ] Optimized images for mobile
- [ ] Minimal JavaScript for mobile
- [ ] Uses lazy loading where appropriate

## 🧪 Testing

- [ ] Tested on real mobile devices
- [ ] Tested on different browsers
- [ ] Tested with slow network
- [ ] Tested with screen readers
- [ ] Tested in landscape and portrait

## 📱 Platform-Specific

### iOS
- [ ] Safe area insets respected
- [ ] No zoom on input focus
- [ ] Proper status bar handling
- [ ] Supports PWA installation

### Android
- [ ] Material design guidelines
- [ ] Proper back button handling
- [ ] Notification support
- [ ] Chrome custom tabs support

## 🔄 Advanced Features

- [ ] Supports dark mode
- [ ] Respects reduced motion preference
- [ ] Works offline (if applicable)
- [ ] Progressive enhancement
- [ ] Graceful degradation

## 🎨 Visual Polish

- [ ] Consistent spacing across breakpoints
- [ ] Smooth transitions
- [ ] No visual bugs on mobile
- [ ] Icons and imagery look sharp
- [ ] Loading states are clear

## 📝 Documentation

- [ ] Component API is documented
- [ ] Breakpoint usage is clear
- [ ] Examples are provided
- [ ] Edge cases are documented
- [ ] Migration path exists

---

## Quick Test Commands

```bash
# Test on different screen sizes
npm run dev

# Run responsive tests
npm test -- responsive

# Check bundle size
npm run build
npm run analyze

# Lighthouse mobile audit
npm run lighthouse
```

---

## Common Issues & Solutions

### Issue: Horizontal Scroll on Mobile
**Solution:** Add `overflow-x: hidden` to body or use `ResponsiveContainer`

### Issue: Text Too Small on Mobile
**Solution:** Use `ResponsiveText` or set minimum font size of 16px for inputs

### Issue: Touch Targets Too Small
**Solution:** Use `touch-target` class or ensure minimum 44x44px

### Issue: Images Don't Scale
**Solution:** Use `max-width: 100%; height: auto;` or `ResponsiveImageCard`

### Issue: Navigation Not Mobile-Friendly
**Solution:** Use `MobileMenu` component

### Issue: Tables Break on Mobile
**Solution:** Use `ResponsiveTable` with `mobileCardView` prop

---

Remember: Test on real devices, not just browser dev tools!
