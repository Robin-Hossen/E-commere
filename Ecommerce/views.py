from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend


import requests
import uuid
from decimal import Decimal, InvalidOperation
from django.conf import settings
from django.db import transaction
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes

from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from .models import User, UserProfile, Category, Product, ProductImage, Wishlist, Order, OrderItem, Cart, CartItem, Review, Payment, PromoBanner
from .serializers import PaymentSerializer, ReviewSerializer, UserSerializer, UserProfileSerializer, CategorySerializer, ProductSerializer, ProductImageSerializer, WishlistSerializer, OrderSerializer, OrderItemSerializer, CartSerializer, CartItemSerializer, PromoBannerSerializer


# Create your views here.

class UserViewSet(ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['username']
    ordering_fields = ['id']

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        if self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]




class UserProfileViewSet(ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['user__username', 'phone', 'city']
    ordering_fields = ['id']




class PromoBannerViewSet(ModelViewSet):
    queryset = PromoBanner.objects.all()
    serializer_class = PromoBannerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        # Admin chara keu banner change korte parbe na
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.annotate(
        product_count=Count('products', distinct=True)
    )
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']




class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'price', 'stock']
    search_fields = ['name','category__name']
    ordering_fields = ['id', 'name', 'price','created_at', 'updated_at']

    def get_permissions(self):
        if self.action in ['create','update','partial_update','destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        # Same name-er product thakle notun product create hobe na —
        # shudhu stock barbe (redundancy roddho)
        incoming_name = (request.data.get('name') or '').strip()
        incoming_stock = int(request.data.get('stock') or 0)

        match = Product.objects.filter(name__iexact=incoming_name).first()
        if match:
            match.stock = match.stock + incoming_stock
            match.save(update_fields=['stock'])
            return Response(
                self.get_serializer(match).data,
                status=status.HTTP_200_OK,
            )
        return super().create(request, *args, **kwargs)


class ProductImageViewSet(ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['product']
    search_fields = ['product__name']
    ordering_fields = ['id', 'created_at']



class WishlistViewSet(ModelViewSet):
    # queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user', 'status']
    search_fields = ['user__username', 'status']
    ordering_fields = ['id', 'created_at']

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()




class OrderItemViewSet(ReadOnlyModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['order', 'product']
    search_fields = ['order__id', 'product__name']
    ordering_fields = ['id']

    def get_queryset(self):
        if self.request.user.is_staff:
            return OrderItem.objects.all()
        return OrderItem.objects.filter(order__user=self.request.user)





class CartViewSet(ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user']
    search_fields = ['user__username']
    ordering_fields = ['id']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Cart.objects.all()
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()



class CartItemViewSet(ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['cart', 'product']
    search_fields = ['cart__user__username', 'product__name']
    ordering_fields = ['id']

    def get_queryset(self):
        if self.request.user.is_staff:
            return CartItem.objects.all()
        return CartItem.objects.filter(cart__user=self.request.user)






class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['product', 'user']

    def get_permissions(self):
        # Review list/detail keu dekhte parbe, create korte hole login lagbe
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)






class PaymentViewSet(ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(order__user=self.request.user)


# SSLCOMMERZ ar kahini akhane
class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if order.status in ['Paid', 'Shipped', 'Delivered']:
            return Response({'error': 'This order has already been paid.'}, status=status.HTTP_400_BAD_REQUEST)

        # ইউনিক ট্রানজেকশন আইডি জেনারেট করা
        tran_id = f"TRAN_{order.id}_{uuid.uuid4().hex[:16]}"
        callback_base_url = settings.SSLCOMMERZ_CALLBACK_BASE_URL.rstrip('/')

        # SSLCommerz Sandbox-এর ফিল্ডসমূহ
        post_data = {
            'store_id': settings.SSLCOMMERZ_STORE_ID,
            'store_passwd': settings.SSLCOMMERZ_STORE_PASSWORD,
            'total_amount': str(order.total_price),
            'currency': 'BDT',
            'tran_id': tran_id,
            'success_url': f'{callback_base_url}/api/payment/success/',
            'fail_url': f'{callback_base_url}/api/payment/fail/',
            'cancel_url': f'{callback_base_url}/api/payment/cancel/',
            'cus_name': request.user.username,
            'cus_email': request.user.email or 'customer@example.com',
            'cus_add1': 'Dhaka',
            'cus_city': 'Dhaka',
            'cus_postcode': '1200',
            'cus_country': 'Bangladesh',
            'cus_phone': '01700000000',
            'shipping_method': 'NO',
            'product_name': f'Order #{order.id}',
            'product_category': 'Ecommerce',
            'product_profile': 'general',
        }

        # SSLCommerz API Endpoint (Sandbox URL)
        sslcommerz_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"

        try:
            response = requests.post(sslcommerz_url, data=post_data, timeout=15)
            response.raise_for_status()
            response_data = response.json()
        except (requests.RequestException, ValueError):
            return Response({'error': 'Payment gateway is unavailable.'}, status=status.HTTP_502_BAD_GATEWAY)

        if response_data.get('status') == 'SUCCESS':
            # পেমেন্ট রেকর্ড ডাটাবেজে তৈরি করা
            Payment.objects.update_or_create(
                order=order,
                defaults={
                    'amount': order.total_price,
                    'payment_method': 'SSLCommerz',
                    'transaction_id': tran_id,
                    'payment_status': 'Pending',
                    'is_successful': False,
                },
            )
            # ফ্রন্টএন্ডকে পেমেন্ট পেজের URL রিটার্ন করা
            return Response({'GatewayPageURL': response_data['GatewayPageURL']}, status=status.HTTP_200_OK)

        return Response({'error': 'Payment initialization failed'}, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------------------------------------------
# SSLCommerz Callbacks (Success & Fail Handlers)
# -------------------------------------------------------------------

def _validate_sslcommerz_payment(payment, data):
    val_id = data.get('val_id')
    if not val_id:
        return False

    validation_url = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
    try:
        response = requests.get(
            validation_url,
            params={
                'val_id': val_id,
                'store_id': settings.SSLCOMMERZ_STORE_ID,
                'store_passwd': settings.SSLCOMMERZ_STORE_PASSWORD,
                'format': 'json',
            },
            timeout=15,
        )
        response.raise_for_status()
        validation_data = response.json()
        gateway_amount = Decimal(str(validation_data.get('amount', '0')))
    except (requests.RequestException, ValueError, InvalidOperation):
        return False

    return (
        validation_data.get('status') in ['VALID', 'VALIDATED']
        and validation_data.get('tran_id') == payment.transaction_id
        and validation_data.get('currency') == 'BDT'
        and gateway_amount == payment.amount
    )


@api_view(['GET', 'POST'])
@permission_classes([AllowAny]) # SSLCommerz সার্ভার থেকে রিকোয়েস্ট আসবে তাই AllowAny
def payment_success(request):
    data = request.data
    tran_id = data.get('tran_id')

    try:
        payment = Payment.objects.get(transaction_id=tran_id)
        if not _validate_sslcommerz_payment(payment, data):
            return Response({'error': 'Payment validation failed.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            payment.payment_status = 'Paid'
            payment.is_successful = True
            payment.save(update_fields=['payment_status', 'is_successful'])
            payment.order.status = 'Paid'
            payment.order.save(update_fields=['status', 'updated_at'])

        return Response({'message': 'Payment successful!'}, status=status.HTTP_200_OK)
    except Payment.DoesNotExist:
        return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def payment_fail(request):
    tran_id = request.data.get('tran_id')
    try:
        payment = Payment.objects.get(transaction_id=tran_id)
        payment.payment_status = 'Failed'
        payment.save()

        order = payment.order
        payment.order.status = 'Pending'
        payment.order.save(update_fields=['status', 'updated_at'])

        return Response({'message': 'Payment failed or cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
    except Payment.DoesNotExist:
        return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def payment_cancel(request):
    tran_id = request.data.get('tran_id')
    try:
        payment = Payment.objects.get(transaction_id=tran_id)
        payment.payment_status = 'Cancelled'
        payment.is_successful = False
        payment.save(update_fields=['payment_status', 'is_successful'])
        payment.order.status = 'Cancelled'
        payment.order.save(update_fields=['status', 'updated_at'])
        return Response({'message': 'Payment cancelled.'}, status=status.HTTP_200_OK)
    except Payment.DoesNotExist:
        return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)