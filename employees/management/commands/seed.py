import os
import random
import time
from itertools import product
from django.core.management.base import BaseCommand
from django.db import transaction
from employees.models import Employee

class Command(BaseCommand):
    help = 'Seeds the database with 10,000 employees'

    def handle(self, *args, **kwargs):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        first_names_path = os.path.join(base_dir, 'first_names.txt')
        last_names_path = os.path.join(base_dir, 'last_names.txt')

        try:
            with open(first_names_path, 'r') as f:
                first_names = [line.strip() for line in f if line.strip()]
            with open(last_names_path, 'r') as f:
                last_names = [line.strip() for line in f if line.strip()]
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"Could not find name files at {base_dir}"))
            return

        if not first_names or not last_names:
            self.stdout.write(self.style.ERROR("Name files are empty"))
            return

        job_titles = ["Software Engineer", "Product Manager", "HR Specialist", "Data Scientist", "Marketing Executive", "Sales Representative", "DevOps Engineer", "QA Engineer", "Design Lead", "Finance Analyst"]
        countries = ["India", "USA", "UK", "Canada", "Australia", "Germany", "France", "Singapore", "Japan", "Brazil"]

        # To get 10,000, we can just randomly sample or use cartesian product and duplicate.
        # Random generation is fine since we just need 10,000 records.
        target_count = 10000
        batch_size = 2000
        employees_to_create = []

        self.stdout.write(self.style.WARNING(f'Starting seeding of {target_count} employees...'))
        start_time = time.time()

        for i in range(target_count):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            job_title = random.choice(job_titles)
            country = random.choice(countries)
            salary = random.randint(30000, 200000)

            employees_to_create.append(
                Employee(
                    first_name=first_name,
                    last_name=last_name,
                    job_title=job_title,
                    country=country,
                    salary=salary
                )
            )

        # Use bulk_create for performance
        with transaction.atomic():
            # Clear existing logic if needed (optional)
            # Employee.objects.all().delete() 
            
            for i in range(0, len(employees_to_create), batch_size):
                batch = employees_to_create[i:i + batch_size]
                Employee.objects.bulk_create(batch)
                self.stdout.write(self.style.SUCCESS(f'Created batch of {len(batch)}'))

        end_time = time.time()
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {target_count} employees in {end_time - start_time:.2f} seconds.'))
