import { Injectable, signal, computed, effect } from '@angular/core';
import { STORAGE_KEYS } from '../../constants/app-config';

/**
 * Sidebar State
 */
export interface SidebarState {
  isOpen: boolean;
  isPinned: boolean;
  width: number;
}

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
 * - Sidebar state (open/closed, pinned)
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
  // Sidebar state
  private sidebar = signal<SidebarState>(this.loadSidebarState());
  readonly sidebar$ = this.sidebar.asReadonly();
  readonly isSidebarOpen = computed(() => this.sidebar().isOpen);
  readonly isSidebarPinned = computed(() => this.sidebar().isPinned);

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
    // Auto-save sidebar state
    effect(() => {
      this.saveSidebarState(this.sidebar());
    });

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

  // Sidebar methods

  /**
   * Toggle sidebar open/closed
   */
  toggleSidebar(): void {
    this.sidebar.update((state) => ({ ...state, isOpen: !state.isOpen }));
  }

  /**
   * Open sidebar
   */
  openSidebar(): void {
    this.sidebar.update((state) => ({ ...state, isOpen: true }));
  }

  /**
   * Close sidebar
   */
  closeSidebar(): void {
    this.sidebar.update((state) => ({ ...state, isOpen: false }));
  }

  /**
   * Toggle sidebar pinned state
   */
  toggleSidebarPinned(): void {
    this.sidebar.update((state) => ({ ...state, isPinned: !state.isPinned }));
  }

  /**
   * Set sidebar width
   */
  setSidebarWidth(width: number): void {
    this.sidebar.update((state) => ({ ...state, width }));
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
   * Load sidebar state from localStorage
   */
  private loadSidebarState(): SidebarState {
    if (typeof localStorage === 'undefined') {
      return this.getDefaultSidebarState();
    }

    const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultSidebarState();
      }
    }
    return this.getDefaultSidebarState();
  }

  /**
   * Save sidebar state to localStorage
   */
  private saveSidebarState(state: SidebarState): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(state));
    }
  }

  /**
   * Get default sidebar state
   */
  private getDefaultSidebarState(): SidebarState {
    return {
      isOpen: !this.detectMobile(),
      isPinned: !this.detectMobile(),
      width: 260,
    };
  }

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
