from django.contrib import admin

from .models import (
    Cart,
    CartItem,
    Category,
    NewsletterSubscriber,
    Product,
    ProductColor,
    Testimonial,
    WishlistItem,
)


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'style_count', 'order')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'team', 'price', 'badge', 'is_featured', 'is_best_seller', 'is_hero')
    list_filter = ('badge', 'is_featured', 'is_best_seller', 'is_hero', 'category')
    search_fields = ('name', 'team')
    inlines = [ProductColorInline]


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'rating', 'is_active')


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'subscribed_at', 'is_active')


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'updated_at')
    inlines = [CartItemInline]


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
