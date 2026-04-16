/**
 * FilterOptionsService — Heritage Modernist Shop
 *
 * Provides dynamic filter option lists (categories, fabrics, colours, sizes)
 * via `Observable` streams using mock data for now.
 *
 * ── INTEGRATION GUIDE ──────────────────────────────────────────────────────
 * To connect to your real backend, do the following:
 *
 *   1. Inject `HttpClient` in the constructor:
 *        constructor(private http: HttpClient) {}
 *
 *   2. Replace each `of(mock).pipe(delay(120))` line with its HTTP equivalent:
 *        return this.http.get<FilterCategory[]>('/api/filters/categories');
 *
 *   3. Add `HttpClientModule` (or `provideHttpClient()`) in your app config.
 *
 *   4. Update the interface types to match your backend DTO field names.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// ── DTO Interfaces ─────────────────────────────────────────────────────────
// These mirror expected backend API response shapes.

export interface FilterCategory {
  id: string;
  name: string;
  /** Total products in this category (for display count badge). */
  productCount: number;
}

export interface FilterFabric {
  id: string;
  name: string;
}

export interface FilterColor {
  id: string;
  name: string;
  /** Hex colour code for the swatch. */
  hex: string;
  /** Set true for light colours so border is applied for visibility. */
  light?: boolean;
}

export interface FilterSize {
  id: string;
  /** Display label (e.g. 'XS', 'Free Size'). Used for filter matching. */
  label: string;
}

export interface PriceRangeData {
  min: number;
  max: number;
}

// ── Service ────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class FilterOptionsService {

  /**
   * Returns all product categories with product counts.
   * TODO: replace with → this.http.get<FilterCategory[]>('/api/filters/categories')
   */
  getCategories(): Observable<FilterCategory[]> {
    const mock: FilterCategory[] = [
      { id: 'saree',   name: 'Saree',   productCount: 5 },
      { id: 'kurti',   name: 'Kurti',   productCount: 3 },
      { id: 'kurtan',  name: 'Kurtan',  productCount: 2 },
      { id: 'panjabi', name: 'Panjabi', productCount: 2 },
    ];
    return of(mock).pipe(delay(120));
  }

  /**
   * Returns available fabric types across the catalogue.
   * TODO: replace with → this.http.get<FilterFabric[]>('/api/filters/fabrics')
   */
  getFabrics(): Observable<FilterFabric[]> {
    const mock: FilterFabric[] = [
      { id: 'banarasi-silk', name: 'Banarasi Silk' },
      { id: 'chiffon',       name: 'Chiffon'       },
      { id: 'organza',       name: 'Organza'       },
      { id: 'cotton',        name: 'Cotton'        },
      { id: 'muslin-cotton', name: 'Muslin Cotton' },
    ];
    return of(mock).pipe(delay(120));
  }

  /**
   * Returns heritage colour swatches for the colour filter.
   * TODO: replace with → this.http.get<FilterColor[]>('/api/filters/colors')
   */
  getColors(): Observable<FilterColor[]> {
    const mock: FilterColor[] = [
      { id: 'crimson-red',   name: 'Crimson Red',   hex: '#800020'          },
      { id: 'forest-green',  name: 'Forest Green',  hex: '#004d40'          },
      { id: 'midnight-blue', name: 'Midnight Blue', hex: '#191970'          },
      { id: 'antique-gold',  name: 'Antique Gold',  hex: '#b8860b'          },
      { id: 'ivory-white',   name: 'Ivory White',   hex: '#f5f0e8', light: true },
    ];
    return of(mock).pipe(delay(120));
  }

  /**
   * Returns available clothing sizes.
   * TODO: replace with → this.http.get<FilterSize[]>('/api/filters/sizes')
   */
  getSizes(): Observable<FilterSize[]> {
    const mock: FilterSize[] = [
      { id: 'xs',        label: 'XS'        },
      { id: 's',         label: 'S'         },
      { id: 'm',         label: 'M'         },
      { id: 'l',         label: 'L'         },
      { id: 'xl',        label: 'XL'        },
      { id: 'free-size', label: 'Free Size' },
    ];
    return of(mock).pipe(delay(120));
  }

  /**
   * Returns the min/max price range for catalogue price filter.
   * TODO: replace with → this.http.get<PriceRangeData>('/api/filters/price-range')
   */
  getPriceRange(): Observable<PriceRangeData> {
    return of({ min: 0, max: 100000 }).pipe(delay(80));
  }
}
