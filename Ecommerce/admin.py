from django.contrib import admin
from .models import Category, Product, Order, OrderItem, Cart, CartItem, Wishlist, UserProfile,Review,Payment,PromoBanner

@admin.register(PromoBanner)
class PromoBannerAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'heading', 'is_active']

# Admin Panel-এ সুন্দরভাবে দেখানোর জন্য রেজিস্টার
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'stock', 'category']
    list_filter = ['category']
    search_fields = ['name']


# বাকি মডেলগুলো সিম্পল রেজিস্টার
admin.site.register(UserProfile)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Wishlist)
admin.site.register(Review)
admin.site.register(Payment)
