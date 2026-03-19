from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import User


class HealthEndpointsSmokeTests(APITestCase):
    def test_health_endpoint_returns_ok(self):
        response = self.client.get(reverse('health-check'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ok')

    def test_health_ready_endpoint_returns_status_payload(self):
        response = self.client.get(reverse('health-ready'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('status', response.data)
        self.assertIn('database', response.data)


class AuthAndCoreAccessSmokeTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='smoke@example.com',
            password='smoke-pass-123',
            full_name='Smoke User',
            role=User.Role.CLIENT,
        )

    def test_auth_me_requires_authentication(self):
        response = self.client.get(reverse('current-user'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_auth_me_returns_user_when_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('current-user'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_projects_list_is_public_but_create_requires_auth(self):
        list_response = self.client.get(reverse('project-list-create'))
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)

        create_response = self.client.post(
            reverse('project-list-create'),
            {'title': 'Smoke Project', 'description': 'desc'},
            format='json',
        )
        self.assertEqual(create_response.status_code, status.HTTP_403_FORBIDDEN)
