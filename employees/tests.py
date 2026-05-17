import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from employees.models import Employee

@pytest.fixture
def api_client():
    client = APIClient()
    user = User.objects.create_user(username='testuser', password='password123')
    client.force_authenticate(user=user)
    return client

@pytest.fixture
def create_employees():
    Employee.objects.bulk_create([
        Employee(first_name='John', last_name='Doe', job_title='Software Engineer', country='USA', salary=100000),
        Employee(first_name='Jane', last_name='Smith', job_title='Software Engineer', country='USA', salary=120000),
        Employee(first_name='Bob', last_name='Johnson', job_title='Data Scientist', country='USA', salary=110000),
        Employee(first_name='Alice', last_name='Williams', job_title='Software Engineer', country='Canada', salary=90000),
    ])

@pytest.mark.django_db
def test_employee_list(api_client, create_employees):
    url = '/api/employees/'
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 4

@pytest.mark.django_db
def test_employee_create(api_client):
    url = '/api/employees/'
    data = {
        'first_name': 'New',
        'last_name': 'Employee',
        'job_title': 'Developer',
        'country': 'UK',
        'salary': '80000.00'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert Employee.objects.count() == 1

@pytest.mark.django_db
def test_salary_insights_missing_country(api_client):
    url = reverse('salary-insights')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'error' in response.data

@pytest.mark.django_db
def test_salary_insights_success(api_client, create_employees):
    url = reverse('salary-insights')
    
    # Base Insights
    response = api_client.get(f"{url}?country=USA")
    assert response.status_code == status.HTTP_200_OK
    assert response.data['country'] == 'USA'
    assert response.data['min_salary'] == 100000
    assert response.data['max_salary'] == 120000
    assert response.data['avg_salary'] == 110000  # (100+120+110)/3 = 110

    # Job Title Insights
    response = api_client.get(f"{url}?country=USA&job_title=Software Engineer")
    assert response.status_code == status.HTTP_200_OK
    assert response.data['job_title_avg_salary'] == 110000  # (100+120)/2
