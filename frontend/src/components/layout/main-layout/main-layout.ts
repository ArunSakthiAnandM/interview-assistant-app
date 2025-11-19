import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';

/**
 * Main Layout Component
 *
 * Provides the main application layout with:
 * - Header (always visible)
 * - Main content area
 * - Footer
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {}
