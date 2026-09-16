from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import PaymentViewSet,ReviewViewSet,CartItemViewSet,CartViewSet,OrderItemViewSet,OrderViewSet,WishlistViewSet,ProductImageViewSet,ProductViewSet,CategoryViewSet,UserProfileViewSet,UserViewSet,InitiatePaymentView,payment_success,payment_fail,payment_cancel,PromoBannerViewSet
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView
from .serializers import EcommerceTokenObtainPairSerializer


class EcommerceTokenObtainPairView(TokenObtainPairView):
    serializer_class = EcommerceTokenObtainPairSerializer

router=DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'user-profiles', UserProfileViewSet, basename='userprofile')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'product-images', ProductImageViewSet, basename='productimage')
router.register(r'wishlists', WishlistViewSet, basename='wishlist')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'order-items', OrderItemViewSet, basename='orderitem')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'cart-items', CartItemViewSet, basename='cartitem')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'promo-banners', PromoBannerViewSet, basename='promobanner')


urlpatterns = [
    path('',include(router.urls)),
    path('payment/initiate/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('payment/success/', payment_success, name='payment-success'),
    path('payment/fail/', payment_fail, name='payment-fail'),
    path('payment/cancel/', payment_cancel, name='payment-cancel'),

    # Token ar urls
    path('token/', EcommerceTokenObtainPairView.as_view(), name='token_obtain_pair'), # Login (Get access & refresh token)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Get new access token using refresh token
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),   # Verify token validity

]

