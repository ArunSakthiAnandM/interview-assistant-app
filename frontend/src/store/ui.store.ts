import { Injectable, signal, computed } from '@angular/core';

/**
 * UI state interface
 */
export interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  compactView: boolean;
}

/**
 * Global UI Store
 * Manages UI-related state using Angular Signals
 */
@Injectable({
  providedIn: 'root',
})
export class UIStore {
  // Private writable signals
  private _sidebarOpen = signal<boolean>(true);
  private _darkMode = signal<boolean>(false);
  private _compactView = signal<boolean>(false);
  private _loading = signal<boolean>(false);
  private _loadingMessage = signal<string>('');

  // Public readonly signals
  readonly sidebarOpen = this._sidebarOpen.asReadonly();
  readonly darkMode = this._darkMode.asReadonly();
  readonly compactView = this._compactView.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loadingMessage = this._loadingMessage.asReadonly();

  // Computed signals
  readonly theme = computed(() => (this._darkMode() ? 'dark' : 'light'));

  constructor() {
    // Load preferences from localStorage
    this.loadPreferences();
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar(): void {
    this._sidebarOpen.update((open) => !open);
    this.savePreferences();
  }

  /**
   * Set sidebar state
   */
  setSidebar(open: boolean): void {
    this._sidebarOpen.set(open);
    this.savePreferences();
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    this._darkMode.update((dark) => !dark);
    this.savePreferences();
  }

  /**
   * Set dark mode
   */
  setDarkMode(enabled: boolean): void {
    this._darkMode.set(enabled);
    this.savePreferences();
  }

  /**
   * Toggle compact view
   */
  toggleCompactView(): void {
    this._compactView.update((compact) => !compact);
    this.savePreferences();
  }

  /**
   * Set compact view
   */
  setCompactView(enabled: boolean): void {
    this._compactView.set(enabled);
    this.savePreferences();
  }

  /**
   * Set global loading state
   */
  setLoading(loading: boolean, message: string = ''): void {
    this._loading.set(loading);
    this._loadingMessage.set(message);
  }

  /**
   * Save preferences to localStorage
   */
  private savePreferences(): void {
    const preferences: UIState = {
      sidebarOpen: this._sidebarOpen(),
      darkMode: this._darkMode(),
      compactView: this._compactView(),
    };
    localStorage.setItem('ui_preferences', JSON.stringify(preferences));
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): void {
    const stored = localStorage.getItem('ui_preferences');
    if (stored) {
      try {
        const preferences: UIState = JSON.parse(stored);
        this._sidebarOpen.set(preferences.sidebarOpen ?? true);
        this._darkMode.set(preferences.darkMode ?? false);
        this._compactView.set(preferences.compactView ?? false);
      } catch (error) {
        console.error('Failed to load UI preferences:', error);
      }
    }
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this._sidebarOpen.set(true);
    this._darkMode.set(false);
    this._compactView.set(false);
    this._loading.set(false);
    this._loadingMessage.set('');
    localStorage.removeItem('ui_preferences');
  }
}
