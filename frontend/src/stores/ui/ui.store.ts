import { Injectable, signal, computed, effect } from '@angular/core';
import { STORAGE_KEYS } from '../../constants/app-config';

/**
 * Loading State
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * UI Store
 *
 * Manages global UI state across the application:
 * - Loading indicators
 * - Theme preferences
 * - Mobile detection
 *
 * State is persisted to localStorage where appropriate.
 */
@Injectable({
  providedIn: 'root',
})
export class UiStore {
  // Loading state
  private loading = signal<LoadingState>({ isLoading: false });
  readonly loading$ = this.loading.asReadonly();
  readonly isLoading = computed(() => this.loading().isLoading);
  readonly loadingMessage = computed(() => this.loading().message);

  // Theme
  private theme = signal<'light' | 'dark'>(this.loadTheme());
  readonly theme$ = this.theme.asReadonly();
  readonly isDarkTheme = computed(() => this.theme() === 'dark');

  // Mobile detection
  private isMobile = signal<boolean>(this.detectMobile());
  readonly isMobile$ = this.isMobile.asReadonly();

  // Page title
  private pageTitle = signal<string>('');
  readonly pageTitle$ = this.pageTitle.asReadonly();

  constructor() {
    // Auto-save theme
    effect(() => {
      this.saveTheme(this.theme());
    });

    // Listen for window resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.isMobile.set(this.detectMobile());
      });
    }
  }

  // Loading methods

  /**
   * Show loading indicator
   */
  showLoading(message?: string): void {
    this.loading.set({ isLoading: true, message });
  }

  /**
   * Hide loading indicator
   */
  hideLoading(): void {
    this.loading.set({ isLoading: false });
  }

  // Theme methods

  /**
   * Set theme
   */
  setTheme(theme: 'light' | 'dark'): void {
    this.theme.set(theme);
    this.applyTheme(theme);
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // Page title

  /**
   * Set page title
   */
  setPageTitle(title: string): void {
    this.pageTitle.set(title);
    if (typeof document !== 'undefined') {
      document.title = title ? `${title} - Interview Organiser` : 'Interview Organiser';
    }
  }

  // Private helper methods

  /**
   * Load theme from localStorage
   */
  private loadTheme(): 'light' | 'dark' {
    if (typeof localStorage === 'undefined') {
      return 'light';
    }

    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    return stored === 'dark' ? 'dark' : 'light';
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(theme: 'light' | 'dark'): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${theme}-theme`);
    }
  }

  /**
   * Detect if device is mobile
   */
  private detectMobile(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth < 768;
  }
}
