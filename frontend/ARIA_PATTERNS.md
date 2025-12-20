# ARIA Patterns and Examples

Common ARIA patterns used throughout Zali for accessibility.

## Buttons and Controls

### Standard Button
```tsx
<button aria-label="Delete item">
  🗑️
</button>
```

### Toggle Button
```tsx
<button
  aria-pressed={isActive}
  aria-label={isActive ? "Hide details" : "Show details"}
  onClick={() => setIsActive(!isActive)}
>
  {isActive ? "−" : "+"}
</button>
```

### Button with Busy State
```tsx
<button
  aria-busy={isLoading}
  disabled={isLoading}
  aria-label={isLoading ? "Submitting..." : "Submit form"}
>
  {isLoading ? "Loading..." : "Submit"}
</button>
```

## Form Elements

### Text Input with Validation
```tsx
<div>
  <label htmlFor="username">Username</label>
  <input
    id="username"
    aria-invalid={hasError}
    aria-describedby={hasError ? "username-error" : "username-help"}
  />
  {hasError && (
    <p id="username-error" role="alert">
      ✗ {errorMessage}
    </p>
  )}
  {!hasError && (
    <p id="username-help">
      3-20 characters
    </p>
  )}
</div>
```

### Form Group with Fieldset
```tsx
<fieldset>
  <legend>Choose a payment method</legend>
  <div>
    <input type="radio" id="card" name="payment" value="card" />
    <label htmlFor="card">Credit Card</label>
  </div>
  <div>
    <input type="radio" id="wallet" name="payment" value="wallet" />
    <label htmlFor="wallet">Wallet</label>
  </div>
</fieldset>
```

## Dynamic Content

### Live Region - Polite
```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### Live Region - Assertive (Alert)
```tsx
<div role="alert" aria-live="assertive" aria-atomic="true">
  {errorMessage}
</div>
```

### Loading Indicator
```tsx
<div aria-busy="true" aria-label="Loading content...">
  <div className="spinner">Loading...</div>
</div>
```

## Navigation

### Landmark Navigation
```tsx
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main id="main-content">
  {children}
</main>
```

### Skip Link
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Mobile Menu
```tsx
<button
  aria-expanded={menuOpen}
  aria-controls="mobile-menu"
  aria-haspopup="true"
  onClick={() => setMenuOpen(!menuOpen)}
>
  Menu
</button>

{menuOpen && (
  <nav id="mobile-menu" aria-label="Mobile navigation">
    {/* menu items */}
  </nav>
)}
```

## Lists

### Ordered List
```tsx
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>
```

### Leaderboard List
```tsx
<section aria-label="Game leaderboard">
  <h2>Top Players</h2>
  <ol role="list" aria-label="Top 10 players ranking">
    {players.map((player, index) => (
      <li key={player.id} role="listitem">
        <span aria-label={`Rank ${player.rank}`}>
          {player.rank}
        </span>
        <span>{player.name}</span>
        <span aria-label={`Score: ${player.score} points`}>
          {player.score} pts
        </span>
      </li>
    ))}
  </ol>
</section>
```

## Dialogs and Modals

### Modal Dialog
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure?</p>
  <button onClick={onConfirm}>Confirm</button>
  <button onClick={onCancel}>Cancel</button>
</div>
```

## Expandable Content

### Accordion Item
```tsx
<div>
  <button
    aria-expanded={isOpen}
    aria-controls="accordion-content"
    onClick={() => setIsOpen(!isOpen)}
  >
    Section Title
  </button>
  {isOpen && (
    <div id="accordion-content">
      Content goes here
    </div>
  )}
</div>
```

### Tooltip
```tsx
<div>
  <button
    aria-label="Help"
    aria-describedby="tooltip"
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
  >
    ?
  </button>
  {showTooltip && (
    <div id="tooltip" role="tooltip">
      This is the help text
    </div>
  )}
</div>
```

## Tables

### Data Table
```tsx
<table>
  <caption>Player Statistics</caption>
  <thead>
    <tr>
      <th scope="col">Player</th>
      <th scope="col">Score</th>
      <th scope="col">Rank</th>
    </tr>
  </thead>
  <tbody>
    {players.map((player) => (
      <tr key={player.id}>
        <td>{player.name}</td>
        <td>{player.score}</td>
        <td>{player.rank}</td>
      </tr>
    ))}
  </tbody>
</table>
```

## Images

### Meaningful Image
```tsx
<img
  src="/player-avatar.png"
  alt="Profile picture for John Doe"
/>
```

### Decorative Image
```tsx
<img
  src="/decorative-border.png"
  alt=""
  aria-hidden="true"
/>
```

### Complex Image with Description
```tsx
<figure>
  <img
    src="/chart.png"
    alt="Sales chart showing quarterly results"
  />
  <figcaption>
    Q1 showed a 25% increase in sales.
  </figcaption>
</figure>
```

## Labels and Descriptions

### Label Association
```tsx
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />
```

### Hidden Label (Icon Button)
```tsx
<button aria-label="Close menu">
  ✕
</button>
```

### Description Text
```tsx
<div>
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    aria-describedby="password-hint"
  />
  <p id="password-hint">
    At least 8 characters with uppercase, lowercase, and number
  </p>
</div>
```

## Loading States

### Skeleton Screens
```tsx
<div aria-hidden="true">
  <div className="bg-gray-300 animate-pulse">
    {/* Skeleton shape */}
  </div>
</div>
```

### Progress Indicator
```tsx
<div role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
  75% complete
</div>
```

## Error Handling

### Form Validation
```tsx
<div>
  <input
    aria-invalid={hasError}
    aria-describedby={hasError ? "error-message" : undefined}
  />
  {hasError && (
    <p id="error-message" role="alert">
      ✗ This field is required
    </p>
  )}
</div>
```

### Error Summary
```tsx
<section role="region" aria-label="Form errors">
  <h2>Please fix these errors:</h2>
  <ul>
    {errors.map((error) => (
      <li key={error.field}>
        <a href={`#${error.field}`}>
          {error.message}
        </a>
      </li>
    ))}
  </ul>
</section>
```

## Common Patterns

### Icon Button
```tsx
<button aria-label="Delete">
  <TrashIcon aria-hidden="true" />
</button>
```

### Badge/Label
```tsx
<span aria-label="Difficulty: Hard">
  Hard
</span>
```

### Status Indicator
```tsx
<div role="status" aria-live="polite">
  <span className="text-green-600" aria-hidden="true">●</span>
  Connected
</div>
```

### Breadcrumb Navigation
```tsx
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li>
      <span aria-current="page">Product Name</span>
    </li>
  </ol>
</nav>
```

## Best Practices for ARIA

1. **Use Native HTML First**
   - Use `<button>` instead of `<div role="button">`
   - Use `<a>` instead of `<div role="link">`
   - Use `<form>` instead of `<div role="form">`

2. **ARIA Rules**
   - No redundant ARIA
   - Don't hide focusable elements
   - Use proper role hierarchy
   - Test with actual screen readers

3. **Keep It Simple**
   - Only use ARIA when necessary
   - One label per interactive element
   - Clear, concise descriptions

4. **Test Always**
   - Keyboard navigation
   - Screen reader testing
   - Automated accessibility checks
   - Manual validation

## Additional Resources

- [W3C ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- [MDN ARIA Examples](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM ARIA](https://webaim.org/articles/aria/)
