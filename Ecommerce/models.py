from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class User(AbstractUser):
    def __str__(self):
        return self.username

class UserProfile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    phone=models.CharField(max_length=15, blank=True, null=True,unique=True)
    address=models.TextField(blank=True,null=True)
    city=models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.user.username


class PromoBanner(models.Model):
    title=models.CharField(max_length=200, default='Special Promo')
    heading=models.CharField(max_length=200, default='20% Off For All Products')
    description=models.TextField(blank=True, null=True)
    image=models.ImageField(upload_to='banners/', blank=True, null=True)
    button_text=models.CharField(max_length=50, default='SHOP NOW')
    button_link=models.CharField(max_length=200, default='/shop')
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Category(models.Model):
    name=models.CharField(max_length=100, unique=True)
    description=models.TextField(blank=True, null=True)
    slug=models.SlugField(unique=True)
    image=models.ImageField(upload_to='categories/', blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category=models.ForeignKey(Category,on_delete=models.CASCADE,related_name='products')
    name=models.CharField(max_length=100)
    description=models.TextField(blank=True, null=True)
    price=models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage=models.PositiveIntegerField(default=0)
    stock=models.PositiveIntegerField(validators=[MinValueValidator(0)])
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name='images')
    image=models.ImageField(upload_to='products/')
    created_at=models.DateTimeField(auto_now_add=True)

class Wishlist(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name='wishlist')
    products=models.ManyToManyField(Product,related_name='wishlisted_by',)

class Order(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='orders')
    # products=models.ManyToManyField(Product,through='OrderItem',related_name='ordered_by')
    status=models.CharField(max_length=50,
                            choices=[
                                ('Pending','Pending'),
                                ('Processing','Processing'),
                                ('Paid','Paid'),
                                ('Shipped','Shipped'),
                                ('Delivered','Delivered'),
                                ('Cancelled','Cancelled')],default='Pending')
    total_price=models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

class OrderItem(models.Model):
    order=models.ForeignKey(Order,on_delete=models.CASCADE,related_name='items')
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField(default=1)
    price=models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Cart(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name='cart')
    products=models.ManyToManyField(Product,through='CartItem',related_name='in_carts')

class CartItem(models.Model):
    cart=models.ForeignKey(Cart,on_delete=models.CASCADE,related_name='items')
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Review(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='reviews')
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name='reviews')
    rating=models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment=models.TextField(blank=True, null=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.name} - {self.rating}"

class Payment(models.Model):
    order=models.OneToOneField(Order,on_delete=models.CASCADE,related_name='payment')
    payment_method=models.CharField(max_length=50)
    amount=models.DecimalField(max_digits=10, decimal_places=2)
    payment_status=models.CharField(max_length=50)
    transaction_id=models.CharField(max_length=100, unique=True)
    created_at=models.DateTimeField(auto_now_add=True)
    is_successful=models.BooleanField(default=False)

    def __str__(self):
        return f"{self.order.id} - {self.payment_status}"