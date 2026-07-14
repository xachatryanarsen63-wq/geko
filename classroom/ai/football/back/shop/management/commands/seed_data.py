from decimal import Decimal

from django.core.management.base import BaseCommand

from shop.models import Category, Product, ProductColor, Testimonial


class Command(BaseCommand):
    help = 'Seed the database with Forkick storefront data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        categories = [
            {
                'name': 'Home Jerseys',
                'slug': 'home-jerseys',
                'image_url': 'https://images.unsplash.com/photo-1616124619460-ff4ed8f4683c?w=600&h=700&fit=crop&auto=format',
                'style_count': 48,
                'order': 1,
            },
            {
                'name': 'Away Jerseys',
                'slug': 'away-jerseys',
                'image_url': 'https://images.unsplash.com/photo-1552066379-e7bfd22155c5?w=600&h=700&fit=crop&auto=format',
                'style_count': 36,
                'order': 2,
            },
            {
                'name': 'Goalkeeper Kits',
                'slug': 'goalkeeper-kits',
                'image_url': 'https://images.unsplash.com/photo-1488274739786-757973c2dff6?w=600&h=700&fit=crop&auto=format',
                'style_count': 24,
                'order': 3,
            },
            {
                'name': 'Training Shirts',
                'slug': 'training-shirts',
                'image_url': 'https://images.unsplash.com/photo-1562077981-4d7eafd44932?w=600&h=700&fit=crop&auto=format&q=80',
                'style_count': 52,
                'order': 4,
            },
            {
                'name': 'Limited Edition',
                'slug': 'limited-edition',
                'image_url': 'https://images.unsplash.com/photo-1738091063217-1f59463342c9?w=600&h=700&fit=crop&auto=format',
                'style_count': 12,
                'order': 5,
            },
            {
                'name': 'Fan Collection',
                'slug': 'fan-collection',
                'image_url': 'https://images.unsplash.com/photo-1556816214-fda351e4a7fb?w=600&h=700&fit=crop&auto=format',
                'style_count': 60,
                'order': 6,
            },
        ]

        category_map = {}
        for cat_data in categories:
            cat, _ = Category.objects.update_or_create(slug=cat_data['slug'], defaults=cat_data)
            category_map[cat.slug] = cat

        products = [
            {
                'name': 'Elite Pro Jersey',
                'team': 'Home Kit',
                'slug': 'elite-pro-jersey',
                'price': Decimal('89.00'),
                'original_price': None,
                'image_url': 'https://images.unsplash.com/photo-1616124619460-ff4ed8f4683c?w=500&h=600&fit=crop&auto=format',
                'badge': 'new',
                'category': category_map['home-jerseys'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'rating': Decimal('4.5'),
                'review_count': 312,
                'is_featured': True,
                'is_best_seller': True,
                'is_hero': True,
                'colors': [
                    ('Forest', '#0F3D2E'),
                    ('White', '#ffffff'),
                    ('Gold', '#F4C542'),
                ],
            },
            {
                'name': 'Champion Away Kit',
                'team': 'Away Kit',
                'slug': 'champion-away-kit',
                'price': Decimal('79.00'),
                'original_price': None,
                'image_url': 'https://images.unsplash.com/photo-1552066379-e7bfd22155c5?w=500&h=600&fit=crop&auto=format',
                'badge': 'hot',
                'category': category_map['away-jerseys'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'rating': Decimal('4.0'),
                'review_count': 204,
                'is_featured': True,
                'is_best_seller': True,
                'colors': [
                    ('Amber', '#f59e0b'),
                    ('Black', '#111111'),
                    ('Blue', '#3b82f6'),
                ],
            },
            {
                'name': 'Striker Edition',
                'team': 'Match Kit',
                'slug': 'striker-edition',
                'price': Decimal('99.00'),
                'original_price': None,
                'image_url': 'https://images.unsplash.com/photo-1662096909714-e2f206d0a636?w=500&h=600&fit=crop&auto=format',
                'badge': 'limited',
                'category': category_map['limited-edition'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'rating': Decimal('5.0'),
                'review_count': 98,
                'is_featured': True,
                'is_best_seller': True,
                'colors': [
                    ('Red', '#ef4444'),
                    ('Navy', '#1e40af'),
                    ('White', '#ffffff'),
                ],
            },
            {
                'name': 'Fan Favourite',
                'team': 'Fan Kit',
                'slug': 'fan-favourite',
                'price': Decimal('69.00'),
                'original_price': None,
                'image_url': 'https://images.unsplash.com/photo-1563382563268-23859556c3f2?w=500&h=600&fit=crop&auto=format',
                'badge': 'sale',
                'category': category_map['fan-collection'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'rating': Decimal('4.0'),
                'review_count': 441,
                'is_featured': True,
                'is_best_seller': True,
                'colors': [
                    ('Red', '#dc2626'),
                    ('White', '#ffffff'),
                    ('Black', '#111111'),
                ],
            },
            {
                'name': 'Pro Match Jersey 2026',
                'team': 'Home Kit',
                'slug': 'pro-match-jersey-2026',
                'price': Decimal('89.00'),
                'original_price': Decimal('119.00'),
                'image_url': 'https://images.unsplash.com/photo-1616124619460-ff4ed8f4683c?w=380&h=460&fit=crop&auto=format',
                'badge': '',
                'category': category_map['home-jerseys'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'rating': Decimal('4.0'),
                'review_count': 312,
                'is_best_seller': True,
                'colors': [('Forest', '#0F3D2E'), ('White', '#ffffff')],
            },
            {
                'name': 'Stadium Away Kit',
                'team': 'Away Kit',
                'slug': 'stadium-away-kit',
                'price': Decimal('79.00'),
                'original_price': Decimal('99.00'),
                'image_url': 'https://images.unsplash.com/photo-1552066379-e7bfd22155c5?w=380&h=460&fit=crop&auto=format',
                'badge': '',
                'category': category_map['away-jerseys'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'rating': Decimal('4.0'),
                'review_count': 204,
                'is_best_seller': True,
                'colors': [('Amber', '#f59e0b'), ('Black', '#111111')],
            },
            {
                'name': 'Champions Edition',
                'team': 'Match Kit',
                'slug': 'champions-edition',
                'price': Decimal('129.00'),
                'original_price': Decimal('159.00'),
                'image_url': 'https://images.unsplash.com/photo-1662096909714-e2f206d0a636?w=380&h=460&fit=crop&auto=format',
                'badge': 'limited',
                'category': category_map['limited-edition'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'rating': Decimal('5.0'),
                'review_count': 98,
                'is_best_seller': True,
                'colors': [('Red', '#ef4444'), ('Gold', '#F4C542')],
            },
            {
                'name': 'Street Fan Tee',
                'team': 'Fan Kit',
                'slug': 'street-fan-tee',
                'price': Decimal('49.00'),
                'original_price': Decimal('65.00'),
                'image_url': 'https://images.unsplash.com/photo-1563382563268-23859556c3f2?w=380&h=460&fit=crop&auto=format',
                'badge': 'sale',
                'category': category_map['fan-collection'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'rating': Decimal('4.0'),
                'review_count': 441,
                'is_best_seller': True,
                'colors': [('Red', '#dc2626'), ('White', '#ffffff')],
            },
            {
                'name': 'Goalkeeper Pro Kit',
                'team': 'GK Kit',
                'slug': 'goalkeeper-pro-kit',
                'price': Decimal('109.00'),
                'original_price': Decimal('139.00'),
                'image_url': 'https://images.unsplash.com/photo-1738091063217-1f59463342c9?w=380&h=460&fit=crop&auto=format',
                'badge': '',
                'category': category_map['goalkeeper-kits'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'rating': Decimal('4.0'),
                'review_count': 87,
                'is_best_seller': True,
                'colors': [('Green', '#0F3D2E'), ('Black', '#111111')],
            },
        ]

        for prod_data in products:
            colors = prod_data.pop('colors')
            product, _ = Product.objects.update_or_create(slug=prod_data['slug'], defaults=prod_data)
            product.colors.all().delete()
            for name, hex_code in colors:
                ProductColor.objects.create(product=product, name=name, hex_code=hex_code)

        testimonials = [
            {
                'name': 'Marcus Rivera',
                'role': 'Semi-Pro Footballer',
                'avatar_url': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&auto=format',
                'text': (
                    "The breathability is insane. Wore this during a 90-minute match in 30°C heat "
                    "and felt completely dry. Best jersey I've ever owned, period."
                ),
                'rating': 5,
                'order': 1,
            },
            {
                'name': 'Sofia Becker',
                'role': 'Football Coach',
                'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format',
                'text': (
                    'Ordered kits for my entire squad. The quality matches premium brands at half '
                    'the price. Fast shipping and the fit is absolutely on point.'
                ),
                'rating': 5,
                'order': 2,
            },
            {
                'name': 'James Okafor',
                'role': 'Club Captain',
                'avatar_url': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop&auto=format',
                'text': (
                    'The Limited Edition collection is fire. Got the gold trim home jersey and every '
                    'player on the pitch asked where I bought it. Legendary piece.'
                ),
                'rating': 5,
                'order': 3,
            },
        ]

        for i, testi_data in enumerate(testimonials):
            Testimonial.objects.update_or_create(name=testi_data['name'], defaults=testi_data)

        self.stdout.write(self.style.SUCCESS('Seed complete.'))
