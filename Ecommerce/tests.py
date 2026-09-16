from decimal import Decimal
from unittest.mock import Mock, patch

from django.urls import reverse
from rest_framework.test import APITestCase

from .models import CartItem, Category, Order, OrderItem, Payment, Product, User


class EcommerceApiTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			username='customer',
			password='StrongPass123',
		)
		self.other_user = User.objects.create_user(
			username='other-customer',
			password='StrongPass123',
		)
		self.admin = User.objects.create_superuser(
			username='admin',
			password='StrongPass123',
			email='admin@example.com',
		)
		category = Category.objects.create(
			name='Test category',
			slug='test-category',
		)
		self.product = Product.objects.create(
			category=category,
			name='Test product',
			price=Decimal('100.00'),
			discount_percentage=10,
			stock=5,
		)
		self.client.force_authenticate(self.user)

	def test_cart_add_merges_quantity_and_rejects_insufficient_stock(self):
		url = reverse('cartitem-list')

		first_response = self.client.post(
			url,
			{'product_id': self.product.id, 'quantity': 2},
			format='json',
		)
		self.assertEqual(first_response.status_code, 201)

		second_response = self.client.post(
			url,
			{'product_id': self.product.id, 'quantity': 1},
			format='json',
		)
		self.assertEqual(second_response.status_code, 201)
		self.assertEqual(
			CartItem.objects.get(product=self.product).quantity,
			3,
		)

		rejected_response = self.client.post(
			url,
			{'product_id': self.product.id, 'quantity': 3},
			format='json',
		)
		self.assertEqual(rejected_response.status_code, 400)
		self.assertEqual(
			CartItem.objects.get(product=self.product).quantity,
			3,
		)

	def test_order_is_created_from_cart_and_updates_stock(self):
		cart_response = self.client.post(
			reverse('cartitem-list'),
			{'product_id': self.product.id, 'quantity': 2},
			format='json',
		)
		self.assertEqual(cart_response.status_code, 201)

		order_response = self.client.post(
			reverse('order-list'),
			{},
			format='json',
		)

		self.assertEqual(order_response.status_code, 201)
		order = Order.objects.get(user=self.user)
		self.assertEqual(order.total_price, Decimal('180.00'))
		self.assertEqual(order.discount_amount, Decimal('20.00'))
		self.assertEqual(order.status, 'Pending')
		self.assertEqual(OrderItem.objects.filter(order=order).count(), 1)
		self.product.refresh_from_db()
		self.assertEqual(self.product.stock, 3)
		self.assertFalse(CartItem.objects.filter(cart__user=self.user).exists())

	def test_empty_cart_cannot_create_order(self):
		response = self.client.post(
			reverse('order-list'),
			{},
			format='json',
		)

		self.assertEqual(response.status_code, 400)
		self.assertIn('cart', response.data)

	def test_user_cannot_view_another_users_order(self):
		order = Order.objects.create(
			user=self.other_user,
			total_price=Decimal('100.00'),
		)

		response = self.client.get(reverse('order-detail', args=[order.id]))

		self.assertEqual(response.status_code, 404)

	@patch('Ecommerce.views.requests.post')
	def test_payment_initiation_creates_pending_payment(self, mocked_post):
		order = Order.objects.create(
			user=self.user,
			total_price=Decimal('180.00'),
		)
		mocked_post.return_value = Mock(
			status_code=200,
			json=lambda: {
				'status': 'SUCCESS',
				'GatewayPageURL': 'https://sandbox.example/payment',
			},
		)

		response = self.client.post(
			reverse('initiate-payment'),
			{'order_id': order.id},
			format='json',
		)

		self.assertEqual(response.status_code, 200)
		payment = Payment.objects.get(order=order)
		self.assertEqual(payment.payment_status, 'Pending')
		self.assertEqual(payment.amount, order.total_price)
		self.assertFalse(payment.is_successful)

	def test_payment_records_are_read_only(self):
		response = self.client.post(
			reverse('payment-list'),
			{},
			format='json',
		)

		self.assertEqual(response.status_code, 405)

	def test_customer_cannot_manage_users_but_admin_can(self):
		customer_response = self.client.get(reverse('user-list'))
		self.assertEqual(customer_response.status_code, 403)

		self.client.force_authenticate(self.admin)
		admin_response = self.client.get(reverse('user-list'))
		self.assertEqual(admin_response.status_code, 200)

	def test_admin_can_update_customer_without_password_payload(self):
		self.client.force_authenticate(self.admin)
		response = self.client.patch(
			reverse('user-detail', args=[self.user.id]),
			{'first_name': 'Updated'},
			format='json',
		)
		self.assertEqual(response.status_code, 200)
		self.user.refresh_from_db()
		self.assertEqual(self.user.first_name, 'Updated')

	def test_token_endpoint_includes_staff_claim(self):
		response = self.client.post(
			reverse('token_obtain_pair'),
			{'username': 'admin', 'password': 'StrongPass123'},
			format='json',
		)
		self.assertEqual(response.status_code, 200)
		self.assertIn('access', response.data)
		from rest_framework_simplejwt.tokens import AccessToken
		self.assertTrue(AccessToken(response.data['access'])['is_staff'])
from django.test import TestCase

# Create your tests here.
