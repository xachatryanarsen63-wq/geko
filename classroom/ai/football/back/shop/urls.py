from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    CartAddView,
    CartItemDetailView,
    CartView,
    CategoryListView,
    HeroProductView,
    NewsletterSubscribeView,
    ProductDetailView,
    ProductListView,
    ProfileView,
    RegisterView,
    TestimonialListView,
    WishlistItemDetailView,
    WishlistView,
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', ProfileView.as_view(), name='profile'),

    # Catalog
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/hero/', HeroProductView.as_view(), name='hero-product'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('testimonials/', TestimonialListView.as_view(), name='testimonial-list'),

    # Newsletter
    path('newsletter/', NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),

    # Cart (authenticated)
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', CartAddView.as_view(), name='cart-add'),
    path('cart/items/<int:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),

    # Wishlist (authenticated)
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:product_id>/', WishlistItemDetailView.as_view(), name='wishlist-item-detail'),
]
