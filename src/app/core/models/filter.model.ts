export interface FilterState {
  bestSellersOnly: boolean;
  newArrivalsOnly: boolean;
  discountedOnly: boolean;
  priceMax: number;
  selectedCategories: string[];
  selectedFabrics: string[];
  selectedColors: string[];
  selectedSizes: string[];
}

export interface FilterOption {
  name: string;
  count?: number;
  hex?: string;
  light?: boolean;
}

export interface FilterOptions {
  categories: FilterOption[];
  fabrics: FilterOption[];
  colors: FilterOption[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export const getInitialFilterState = (): FilterState => ({
  bestSellersOnly: false,
  newArrivalsOnly: false,
  discountedOnly: false,
  priceMax: 100000,
  selectedCategories: [],
  selectedFabrics: [],
  selectedColors: [],
  selectedSizes: [],
});
