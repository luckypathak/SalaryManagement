from rest_framework import viewsets, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Max, Min
from .models import Employee
from .serializers import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('-created_at')
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Optional: Add simple filtering if needed
        queryset = super().get_queryset()
        country = self.request.query_params.get('country')
        if country:
            queryset = queryset.filter(country=country)
        return queryset

class SalaryInsightsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        country = request.query_params.get('country')
        job_title = request.query_params.get('job_title')

        if not country:
            return Response({"error": "Please provide a 'country' query parameter."}, status=400)

        # Base metrics for the country
        country_qs = Employee.objects.filter(country=country)
        base_metrics = country_qs.aggregate(
            min_salary=Min('salary'),
            max_salary=Max('salary'),
            avg_salary=Avg('salary')
        )

        response_data = {
            "country": country,
            "min_salary": base_metrics['min_salary'],
            "max_salary": base_metrics['max_salary'],
            "avg_salary": base_metrics['avg_salary'],
        }

        # If job_title is provided, get the average for that specific job in the country
        if job_title:
            job_qs = country_qs.filter(job_title=job_title)
            job_metrics = job_qs.aggregate(avg_salary=Avg('salary'))
            response_data["job_title_avg_salary"] = job_metrics['avg_salary']
            response_data["job_title"] = job_title

        return Response(response_data)
