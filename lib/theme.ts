export type AppTheme = 'light' | 'dark';

export function getStoredTheme(): AppTheme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem('theme') || localStorage.getItem('portal_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return document.documentElement.classList.contains('light') ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyGlobalTheme(theme: AppTheme) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.remove('light');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
  }
  try {
    localStorage.setItem('theme', theme);
    localStorage.setItem('portal_theme', theme);
  } catch {}
}

export function toggleGlobalTheme(currentTheme?: AppTheme): AppTheme {
  const active = currentTheme || getStoredTheme();
  const next = active === 'dark' ? 'light' : 'dark';
  applyGlobalTheme(next);
  return next;
}
