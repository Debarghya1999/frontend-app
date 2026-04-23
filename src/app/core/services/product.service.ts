import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      productId: 'fp-1',
      productDescription: 'Handwoven Jamdani Saree',
      category: 'Sarees',
      price: 3499,
      image: '/images/products/jamdani_cotton_saree.png',
      accentColor: '#8b1a2e',
      isBestSeller: true,
      rating: 5,
      reviews: 214,
    },
    {
      productId: 'fp-2',
      productDescription: 'Cotton Ethnic Kurti',
      category: 'Kurtis',
      price: 1299,
      image: '/images/products/cotton_kurti.png',
      accentColor: '#6b3d6e',
      isNew: true,
      rating: 4.9,
      reviews: 132,
    },
    {
      productId: 'fp-3',
      productDescription: 'Classic Bengal Panjabi',
      category: 'Menswear',
      price: 2199,
      image: '/images/products/bengal_panjabi.png',
      accentColor: '#2e5c4a',
      rating: 4.8,
      reviews: 89,
    },
    {
      productId: 'fp-4',
      productDescription: 'Handcrafted Cotton Kurta',
      category: 'Kurtas',
      price: 1850,
      image: '/images/products/cotton_kurta.png',
      accentColor: '#1e3a5f',
      rating: 4.9,
      reviews: 67,
    },
    {
      productId: 'fp-5',
      productDescription: 'Tant Saree — Indigo Weave',
      category: 'Sarees',
      price: 2699,
      image: '/images/products/tant_saree_indigo.png',
      accentColor: '#1b3458',
      rating: 4.7,
      reviews: 98,
    },
    {
      productId: 'fp-6',
      productDescription: 'Muslin Embroidered Kurta',
      category: 'Kurtas',
      price: 2450,
      image: '/images/products/muslin_kurta.png',
      accentColor: '#4a3322',
      isNew: true,
      rating: 4.8,
      reviews: 55,
    },
    {
      productId: 'fp-7',
      productDescription: 'Kantha Stitch Dupatta',
      category: 'Accessories',
      price: 999,
      image: '/images/products/kantha_dupatta.png',
      accentColor: '#5c2b4a',
      rating: 4.6,
      reviews: 171,
    },
    {
      productId: 'fp-8',
      productDescription: 'Dhakai Jamdani Kurti',
      category: 'Kurtis',
      price: 1799,
      image: '/images/products/dhakai_jamdani_kurti.png',
      accentColor: '#3b4a2e',
      isNew: true,
      rating: 5,
      reviews: 43,
    },
    {
      productId: 'fp-9',
      productDescription: 'Silk Blend Lehenga',
      category: 'Lehengas',
      price: 5999,
      image: '/images/products/silk_lehenga.png',
      accentColor: '#6e1a1a',
      isBestSeller: true,
      rating: 4.9,
      reviews: 302,
    },
    {
      productId: 'fp-10',
      productDescription: 'Linen Kurta Pyjama Set',
      category: 'Menswear',
      price: 2999,
      image: '/images/products/linen_kurta_pyjama.png',
      accentColor: '#2c3e35',
      rating: 4.7,
      reviews: 78,
    },
    {
      productId: '1',
      productDescription: 'Royal Zardosi Lehenga',
      subtitle: 'Hand-woven Banarasi Silk',
      category: 'Saree',
      fabric: 'Banarasi Silk',
      price: 84500,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_IfUiIpe6YvOSqAfmZq2j8XLUfOLk-5Qi8Xsy0v9rdVRr70ba8P1CY2TBFhu72NBtVTd6Ya2BhtCl31kS--j_5j51gZSCSo7-yI39im2iXJ1mciWoe0-bthHg_uCzuZjfClMua50Be6i8j2zcYQ99_I0B7CzzrpQ6-kjJEG6IpS4FAgJq9ifGL92cem1gLZooQwFyABfkxj-1JuMny1JnKjAVPOUtk2wVb63wXkpqSHt2gsCyYmZMrecxunXpRk205-sf6nDtJy0A',
      accentColor: '#800020',
      colors: ['Crimson Red'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      isBestSeller: true,
      isNew: false,
      rating: 4.9,
      reviews: 128,
    },
    {
      productId: '2',
      productDescription: 'Emerald Forest Heirloom',
      subtitle: 'Pure Kanjeevaram Silk',
      category: 'Saree',
      fabric: 'Banarasi Silk',
      price: 42200,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkmW7yPn9udgyLgkLJKs9x66LPH-QE27QI9AonxHVjSfzBUVpfcg6ynhu-do7C0n-Wa0RAzIIEYdGt2YSrEV1q2ZAQHhmBRNzer6L3z-LJuZn6-bX5fP3-eyIHphy5P2Wf326UAT0KCier7LM5-3B942J9AsTnnTdc9vfJfEspy_ReR5OqYAj_Lw3dhr_cENDmqM6-jP4s17A2KONxxylmdUB47sL_SI4VVgMO5aHYV0bSSnFU-w_PBixNMBrKiL-x1hRrwhNG9ejy',
      accentColor: '#004d40',
      colors: ['Forest Green'],
      sizes: ['S', 'M', 'L', 'Free Size'],
      isBestSeller: true,
      isNew: false,
      rating: 4.7,
      reviews: 89,
    },
    {
      productId: '3',
      productDescription: 'Moonlight Chikankari Ensemble',
      subtitle: 'Muslin Cotton Blend',
      category: 'Kurti',
      fabric: 'Muslin Cotton',
      price: 28800,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpfIYbWe0wVu2qJ4wfuQd_rI0_WbeHOZcMj_taQkbf1uYblHLU2nmns37DgbzTTMUc7cZEzfSPoC0OoI5MtnL3eddHvQwdxu7WGy_PjzwZoyfZQTwc2KBpw1f8mam3e_440sN-llUMOHIpAdz5SILrOLd7j9OvNounpYvyfJsh-KTzhNFj2pumjdSILWZUiYIxS90e0W1zP5vautl53hk6r3dPF58IVJ1r8Jl3Idy2BperfQIVvqPkuy-oJ9zoHQ3LUPyOC4420_iz',
      accentColor: '#b8860b',
      colors: ['Ivory White'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'Free Size'],
      isBestSeller: false,
      isNew: true,
      rating: 4.8,
      reviews: 64,
      arrivedOn: '2026-04-14',
    },
    {
      productId: '4',
      productDescription: 'Indigo Handloom Saree',
      subtitle: 'Pure Bengal Cotton Weave',
      category: 'Saree',
      fabric: 'Cotton',
      price: 18500,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop&q=80',
      accentColor: '#191970',
      colors: ['Midnight Blue'],
      sizes: ['Free Size'],
      isBestSeller: false,
      isNew: true,
      rating: 4.5,
      reviews: 42,
      arrivedOn: '2026-04-14',
    },
    {
      productId: '5',
      productDescription: 'Saffron Handloom Kurti',
      subtitle: 'Heritage Bengal Cotton',
      category: 'Kurti',
      fabric: 'Cotton',
      price: 12400,
      image: '/images/products/saffron_handloom_kurti.png',
      accentColor: '#b8860b',
      colors: ['Antique Gold'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      isBestSeller: true,
      isNew: false,
      rating: 4.6,
      reviews: 97,
    },
    {
      productId: '6',
      productDescription: 'Crimson Silk Panjabi',
      subtitle: 'Artisan Banarasi Weave',
      category: 'Panjabi',
      fabric: 'Banarasi Silk',
      price: 22000,
      image: '/images/products/crimson_silk_panjabi.png',
      accentColor: '#800020',
      colors: ['Crimson Red'],
      sizes: ['S', 'M', 'L', 'XL'],
      isBestSeller: true,
      isNew: false,
      rating: 4.8,
      reviews: 73,
    },
    {
      productId: '7',
      productDescription: 'Forest Muga Kurta Set',
      subtitle: 'Pure Muga Silk Blend',
      category: 'Kurta',
      fabric: 'Cotton',
      price: 16800,
      image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=600&h=800&fit=crop&q=80',
      accentColor: '#004d40',
      colors: ['Forest Green'],
      sizes: ['S', 'M', 'L', 'XL', 'Free Size'],
      isBestSeller: false,
      isNew: true,
      rating: 4.4,
      reviews: 31,
      arrivedOn: '2026-04-14',
    },
    {
      productId: '8',
      productDescription: 'Ivory Organza Drape',
      subtitle: 'Hand-finished Organza',
      category: 'Saree',
      fabric: 'Organza',
      price: 35600,
      image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop&q=80',
      accentColor: '#b8860b',
      colors: ['Ivory White'],
      sizes: ['Free Size'],
      isBestSeller: false,
      isNew: false,
      rating: 4.7,
      reviews: 55,
    },
    {
      productId: '9',
      productDescription: 'Midnight Chiffon Drape',
      subtitle: 'Featherweight Chiffon',
      category: 'Saree',
      fabric: 'Chiffon',
      price: 24900,
      image: 'https://images.unsplash.com/photo-1596993100471-c3905ddebd7e?w=600&h=800&fit=crop&q=80',
      accentColor: '#191970',
      colors: ['Midnight Blue'],
      sizes: ['Free Size'],
      isBestSeller: true,
      isNew: false,
      rating: 4.9,
      reviews: 111,
    },
    {
      productId: '10',
      productDescription: 'Gold Zari Panjabi',
      subtitle: 'Zari-threaded Muslin Cotton',
      category: 'Panjabi',
      fabric: 'Muslin Cotton',
      price: 19200,
      image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&h=800&fit=crop&q=80',
      accentColor: '#b8860b',
      colors: ['Antique Gold'],
      sizes: ['S', 'M', 'L', 'XL'],
      isBestSeller: false,
      isNew: true,
      rating: 4.3,
      reviews: 28,
      arrivedOn: '2026-03-20',
    },
    {
      productId: '11',
      productDescription: 'Bengal Jamdani Kurti',
      subtitle: 'UNESCO Heritage Jamdani',
      category: 'Kurti',
      fabric: 'Cotton',
      price: 8900,
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=800&fit=crop&q=80',
      accentColor: '#004d40',
      colors: ['Ivory White', 'Forest Green'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'Free Size'],
      isBestSeller: false,
      isNew: false,
      rating: 4.6,
      reviews: 148,
    },
    {
      productId: '12',
      productDescription: 'Heritage Silk Sherwani',
      subtitle: 'Hand-embroidered Banarasi',
      category: 'Kurtan',
      fabric: 'Banarasi Silk',
      price: 31400,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop&q=80',
      accentColor: '#800020',
      colors: ['Crimson Red', 'Antique Gold'],
      sizes: ['S', 'M', 'L', 'XL'],
      isBestSeller: true,
      isNew: false,
      rating: 4.8,
      reviews: 86,
    },
    {
        productId: 'na-5',
        productDescription: 'Crimson Ektara Kurti',
        subtitle: 'Heritage Block-print Cotton',
        category: 'Kurti', fabric: 'Pure Cotton', price: 9800,
        image: 'https://images.unsplash.com/photo-1583391733975-5408b7f1b2b9?w=600&h=800&fit=crop&q=80',
        accentColor: '#800020', colors: ['Crimson Red'],
        sizes: ['XS','S','M','L','XL','Free Size'],
        isBestSeller: false, isNew: true, rating: 4.6, reviews: 19,
        arrivedOn: '2026-03-20',
      },
      {
        productId: 'na-6',
        productDescription: 'Ivory Tussar Drape',
        subtitle: 'Raw Tussar Silk, Hand-finished',
        category: 'Saree', fabric: 'Tussar Silk', price: 38400,
        image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop&q=80',
        accentColor: '#b8860b', colors: ['Ivory White'],
        sizes: ['Free Size'],
        isBestSeller: false, isNew: true, rating: 4.7, reviews: 15,
        arrivedOn: '2026-03-20',
      },
      {
        productId: 'na-7',
        productDescription: 'Midnight Jamdani Shawl',
        subtitle: 'UNESCO Heritage Weave',
        category: 'Saree', fabric: 'Fine Cotton', price: 22600,
        image: 'https://images.unsplash.com/photo-1596993100471-c3905ddebd7e?w=600&h=800&fit=crop&q=80',
        accentColor: '#191970', colors: ['Midnight Blue'],
        sizes: ['Free Size'],
        isBestSeller: false, isNew: true, rating: 4.9, reviews: 8,
        arrivedOn: '2026-02-10',
      },
  ];

  /** Gallery images shared across products for demo purposes */
  private readonly galleryImages: string[] = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDZw7Tr4P7vZ6JMtCqe4qfi9DquaX9xN_FfWC57_jCZS_8ooPppLzruIwGdacp7AuKnKz1Z0k2vTokHqjPJlzHYV8sxapiaAzFCE48pQFxZIJLcFuV9R0RG2l-_afjNwPx5J6HRdNcjPHEgiAH8cfNit-RVPY1_DY1H7kuwgLWClu9Af1ad_HqPALts-Z4HMMUpahL3jBFmdf52VE1I4mLFlXjDbyTRFmkGhpykQE1DdypzTbnSEb89QgCQlPDA1X8HRCIv-mRBtnY0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDyRwaKuXr-Ce7JIhNGiuZDuh_PWcXfgvD8L0PJ-O0csta4CUycMUcnsCGJD561VSvGS438Cu77Ld8aNQx7SFkJiZ9pQ-JDkFpohzQCgTDeb72HmfL27uCECi7SkUEDK2fCzBQ8nPd0aXuCi6W4Ym0yH-pxp-nKjZ8rFOgm0gPRx4cbfWwxDRzUm_P-glbg_tQDWmwovCCA-dIcxHSxg9ps_XsnlIyAaM947h_SRoOY_C8eX6dovdPQjFdLkasQGXDacFkcHCj8pqv2',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAIGeOJxPuvkr1C0x1Wo0KCQONo6MzacpFruqNofmncI-tNc2ClTFdSdnVJf3DggnDlVi6PPO_MgvxeDfHb7DX4_BBMq0FxwfMRZTzXPA1sfpE_OPrwreRF1BZCh6zY4elqcUcKucynxvcX0H7SqeNWpU-G6WKSxWUb2Qxdh6ey4dMi45YOU9oZPp9CEmCGfhObNI7ofGeYNRij7SU-4oX5Mug-KjjRTkoSTizT18tNxq0Hv79Ra5F53EC-Od-DnUJWnEuEid57irne',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuARYrVNbs0z_OfSx3fhlqvWViTLGy6iLzn1NI9Xz9m-KJdIq-Chhcv7YmkA0SS7LbUuEaVFr5U8wuXVUqnpYCch0uXtVexrzkPwxhvt0DJeH3FuBan8-JLMnpvkMliioYk5OoaL5irk1MhyanRiH7S0QmuCaOCBaQc9CbEeddJQ8xV7B2GDpxmnQaZvZ_AIYM_YFrJ-nAMqBoGSupnSx_c8GsU-k6Z_525cZBoJkCXHniFZkCxKf-1K05uIEvsGXSQsZqnBp-OMJRI8',
  ];

  private readonly defaultHighlights = [
    'Handcrafted by master artisans using traditional techniques',
    'Premium quality fabric with exceptional drape and texture',
    'Timeless design that bridges heritage and contemporary style',
    'Each piece is unique — slight variations celebrate the handmade process',
    'Ethically sourced materials supporting local weaver communities',
  ];

  private readonly defaultCare = [
    'Dry clean recommended for best results',
    'Store in a cool, dry place away from direct sunlight',
    'Use a muslin cloth when ironing on low heat',
    'Avoid prolonged exposure to perfumes or deodorants',
    'Handle embroidered areas with care',
  ];

  constructor() {
    this.initProducts();
  }

  private initProducts(): void {
    this.products = this.products.map(p => {
      const isOnSale = Math.random() < 0.25;
      let originalPrice = p.originalPrice;
      if (isOnSale && !originalPrice) {
        const markup = 1.15 + (Math.random() * 0.25);
        originalPrice = Math.round(p.price * markup);
      }
      const discount = originalPrice && originalPrice > p.price
        ? Math.round(((originalPrice - p.price) / originalPrice) * 100)
        : undefined;

      // Enrich with detail-page data
      const gallery = p.gallery ?? [p.image, ...this.galleryImages.slice(0, 3)];
      const description = p.description ??
        `A masterpiece of tactile luxury, the ${p.productDescription} is handwoven by master artisans over many hours of dedicated craft. This exquisite piece features traditional embroidery on rich ${p.fabric || 'premium'} fabric, offering a modern interpretation of ancient regal silhouettes. Designed to be a timeless heirloom, it celebrates the art of Indian textile heritage.`;
      const highlights = p.highlights ?? this.defaultHighlights;
      const careInstructions = p.careInstructions ?? this.defaultCare;

      return { ...p, isOnSale, originalPrice, discount, gallery, description, highlights, careInstructions };
    });
  }

  getProducts(): Observable<Product[]> {
    return of(this.products).pipe(delay(120));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return of(this.products.slice(0, 10)).pipe(delay(100));
  }

  getProductById(productId: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.productId === productId);
    return of(product).pipe(delay(80));
  }

  getRelatedProducts(productId: string, limit = 6): Observable<Product[]> {
    const current = this.products.find(p => p.productId === productId);
    if (!current) return of([]);
    const related = this.products
      .filter(p => p.productId !== productId && p.category === current.category)
      .slice(0, limit);
    // If not enough in same category, pad with other products
    if (related.length < limit) {
      const others = this.products
        .filter(p => p.productId !== productId && !related.includes(p))
        .slice(0, limit - related.length);
      related.push(...others);
    }
    return of(related).pipe(delay(100));
  }
}
