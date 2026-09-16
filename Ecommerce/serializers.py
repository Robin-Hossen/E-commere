from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction
from .models import  User, UserProfile,Category, Product, ProductImage, Wishlist, Order, OrderItem, Cart, CartItem,Review,Payment,PromoBanner


class EcommerceTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        return token


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password', 'first_name', 'last_name', 'is_staff']
        read_only_fields = ['is_staff']

    def validate(self, attrs):
        if self.instance is None and not attrs.get('password'):
            raise serializers.ValidationError({'password': 'This field is required.'})
        if self.instance is None and attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if self.instance is not None and 'password' in attrs and attrs['password'] != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data) # create_user অটোমেটিক পাসওয়ার্ড হ্যাশ করে

    def update(self, instance, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password', None)
        for attribute, value in validated_data.items():
            setattr(instance, attribute, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance



class UserProfileSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model=UserProfile
        fields=['id','user','address','phone','city']



class PromoBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model=PromoBanner
        fields=['id','title','heading','description','image','button_text','button_link','is_active']


class CategorySerializer(serializers.ModelSerializer):
    product_count=serializers.IntegerField(read_only=True)
    image=serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model=Category
        fields=['id','name','description','slug','image','product_count']





class ProductSerializer(serializers.ModelSerializer):
    category=CategorySerializer(read_only=True)
    category_id=serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(),source='category',write_only=True)
    images = serializers.SerializerMethodField()
    discounted_price=serializers.SerializerMethodField()
    rating_average=serializers.SerializerMethodField()
    review_count=serializers.SerializerMethodField()
    # Create/update er somoy ek sathe multiple image upload er jonne
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    def get_images(self, obj):
        return ProductImageSerializer(obj.images.all(), many=True).data

    class Meta:
        model=Product
        fields=['id','category','category_id','name','description','price','stock','images','uploaded_images','rating_average','review_count','created_at','updated_at','discounted_price','discount_percentage']

    def create(self, validated_data):
        image_files = validated_data.pop('uploaded_images', [])
        product = super().create(validated_data)
        for image_file in image_files:
            ProductImage.objects.create(product=product, image=image_file)
        return product

    def update(self, instance, validated_data):
        image_files = validated_data.pop('uploaded_images', [])
        instance = super().update(instance, validated_data)
        for image_file in image_files:
            ProductImage.objects.create(product=instance, image=image_file)
        return instance

    def get_rating_average(self,obj):
        reviews=obj.reviews.all()
        if not reviews:
            return None
        total=sum(r.rating for r in reviews)
        return round(total/len(reviews),1)

    def get_review_count(self,obj):
        return obj.reviews.count()

    def get_discounted_price(self,obj):
        if obj.discount_percentage > 0:
            discount=(obj.price*obj.discount_percentage)/100
            return obj.price-discount
        return obj.price




class ProductImageSerializer(serializers.ModelSerializer):
    product=serializers.PrimaryKeyRelatedField(read_only=True)
    product_id=serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(),source='product',write_only=True)
    class Meta:
        model=ProductImage
        fields=['id','product','product_id','image','created_at']



class WishlistSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    products=ProductSerializer(many=True,read_only=True)
    product_ids=serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(),many=True,source='products',write_only=True)
    class Meta:
        model=Wishlist
        fields=['id','user','products','product_ids']



class OrderSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    items = serializers.SerializerMethodField()

    def get_items(self, obj):
        return OrderItemSerializer(obj.items.all(), many=True).data

    class Meta:
        model=Order
        fields=['id','user','status','total_price','discount_amount','items','created_at','updated_at']
        read_only_fields=['user','total_price','discount_amount','items','created_at','updated_at']

    def create(self, validated_data):
        user = self.context['request'].user #loggrd-in user ber kora

        with transaction.atomic():
            cart_items = list(
                CartItem.objects.select_for_update() #concurrency problem prevent kora,, at time  a multiple use stock poriman order korle
                .filter(cart__user=user)
                .select_related('product')
            )
            if not cart_items:
                raise serializers.ValidationError({'cart': 'Your cart is empty.'})

            product_ids = [item.product_id for item in cart_items]
            products = Product.objects.select_for_update().in_bulk(product_ids)
            order_items = []
            total_price = 0
            discount_amount = 0

            for cart_item in cart_items:
                product = products[cart_item.product_id]
                if cart_item.quantity > product.stock:
                    raise serializers.ValidationError({
                        'stock': f'Not enough stock for {product.name}.'
                    })

                item_price = product.price * (100 - product.discount_percentage) / 100
                total_price += item_price * cart_item.quantity
                discount_amount += (
                    product.price - item_price
                ) * cart_item.quantity
                order_items.append(
                    OrderItem(
                        product=product,
                        quantity=cart_item.quantity,
                        price=item_price,
                    )
                )
                product.stock -= cart_item.quantity

            order = Order.objects.create(
                user=user,
                total_price=total_price,
                discount_amount=discount_amount,
            )
            for order_item in order_items:
                order_item.order = order
            OrderItem.objects.bulk_create(order_items)

            for product in products.values():
                product.save(update_fields=['stock', 'updated_at'])
            CartItem.objects.filter(pk__in=[item.pk for item in cart_items]).delete()

        return order



class OrderItemSerializer(serializers.ModelSerializer):
    order=serializers.PrimaryKeyRelatedField(read_only=True)
    product=ProductSerializer(read_only=True)
    class Meta:
        model=OrderItem
        fields=['id','order','product','quantity','price']
        read_only_fields=['id','order','product','quantity','price']



class CartSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    products=ProductSerializer(many=True,read_only=True)
    items = serializers.SerializerMethodField()

    def get_items(self, obj):
        return CartItemSerializer(obj.items.all(), many=True).data

    class Meta:
        model=Cart
        fields=['id','user','products','items']
        read_only_fields=['id','user','products','items']

    def create(self, validated_data):
        user = self.context['request'].user
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart



class CartItemSerializer(serializers.ModelSerializer):
    cart=serializers.PrimaryKeyRelatedField(read_only=True)
    product=ProductSerializer(read_only=True)
    product_id=serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(),source='product',write_only=True)
    class Meta:
        model=CartItem
        fields=['id','cart','product','product_id','quantity']
        read_only_fields=['id','cart','product']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError('Quantity must be at least 1.')
        if self.instance is not None and value > self.instance.product.stock:
            raise serializers.ValidationError({
                'quantity': f'Only {self.instance.product.stock} items are available.'
            })
        return value

    def create(self, validated_data):#jokh frontend new cart item create korbe tokhn ata kaj korbe
        user = self.context['request'].user #current user ber kora
        product = validated_data['product']
        quantity = validated_data['quantity']

        with transaction.atomic():
            cart, _ = Cart.objects.get_or_create(user=user)#user ar cart ase kina chek ,, thakle oi cart nau , na thakle banau
            cart_item = CartItem.objects.select_for_update().filter(
                cart=cart,
                product=product,
            ).first()
            requested_quantity = quantity + (cart_item.quantity if cart_item else 0)

            if requested_quantity > product.stock:
                raise serializers.ValidationError({
                    'quantity': f'Only {product.stock} items are available.'
                })

            if cart_item:
                cart_item.quantity = requested_quantity
                cart_item.save(update_fields=['quantity'])
            else:
                cart_item = CartItem.objects.create(
                    cart=cart,
                    product=product,
                    quantity=quantity,
                )
        return cart_item



class ReviewSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    product=ProductSerializer(read_only=True)
    product_id=serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(),source='product',write_only=True)
    class Meta:
        model=Review
        fields=['id','user','product','product_id','rating','comment','created_at']




class PaymentSerializer(serializers.ModelSerializer):
    order=OrderSerializer(read_only=True)
    class Meta:
        model=Payment
        fields=['id','order','amount','payment_method','payment_status','transaction_id','is_successful','created_at']
        read_only_fields=['id','order','amount','payment_method','payment_status','transaction_id','is_successful','created_at']
