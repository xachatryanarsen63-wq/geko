from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem, Category, Product, Testimonial, WishlistItem
from .serializers import (
    AddToCartSerializer,
    CartItemSerializer,
    CartSerializer,
    CategorySerializer,
    NewsletterSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    RegisterSerializer,
    TestimonialSerializer,
    UserSerializer,
    WishlistItemSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'user': UserSerializer(user).data,
                'message': 'Account created successfully.',
            },
            status=status.HTTP_201_CREATED,
        )


class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.prefetch_related('colors')
        category = self.request.query_params.get('category')
        badge = self.request.query_params.get('badge')
        featured = self.request.query_params.get('featured')
        best_seller = self.request.query_params.get('best_seller')

        if category:
            queryset = queryset.filter(category__slug=category)
        if badge:
            queryset = queryset.filter(badge=badge)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        if best_seller == 'true':
            queryset = queryset.filter(is_best_seller=True)

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.prefetch_related('colors').select_related('category')
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class HeroProductView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        product = Product.objects.filter(is_hero=True).prefetch_related('colors').first()
        if not product:
            return Response({'detail': 'No hero product configured.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProductDetailSerializer(product).data)


class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]


class NewsletterSubscribeView(generics.CreateAPIView):
    serializer_class = NewsletterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'message': "You're on the list. We'll be in touch!"},
            status=status.HTTP_201_CREATED,
        )


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_or_create_cart(request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart = get_or_create_cart(request.user)
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        cart = get_or_create_cart(request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=data['product_id'],
            size=data['size'],
            color=data.get('color', ''),
            defaults={'quantity': data['quantity']},
        )
        if not created:
            item.quantity += data['quantity']
            item.save()

        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        cart = get_or_create_cart(request.user)
        try:
            item = cart.items.get(pk=item_id)
        except CartItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if quantity is not None:
            if int(quantity) < 1:
                item.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            item.quantity = int(quantity)
            item.save()

        return Response(CartItemSerializer(item).data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request.user)
        deleted, _ = cart.items.filter(pk=item_id).delete()
        if not deleted:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user).select_related('product').prefetch_related(
            'product__colors'
        )
        return Response(WishlistItemSerializer(items, many=True).data)

    def post(self, request):
        serializer = WishlistItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item, created = WishlistItem.objects.get_or_create(
            user=request.user,
            product=serializer.validated_data['product'],
        )
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(WishlistItemSerializer(item).data, status=status_code)


class WishlistItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):
        deleted, _ = WishlistItem.objects.filter(user=request.user, product_id=product_id).delete()
        if not deleted:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
