from django.core.management.base import BaseCommand

from apps.companies.models import CompanyProfile
from apps.freelancers.models import FreelancerProfile
from apps.projects.models import Project, PublicationStatus
from apps.users.models import User


class Command(BaseCommand):
    help = 'Seed lightweight local development data for yep-21 backend.'

    def handle(self, *args, **options):
        client_user, _ = User.objects.get_or_create(
            email='client@example.com',
            defaults={'full_name': 'Client User', 'role': User.Role.CLIENT},
        )
        client_user.set_password('devpass123!')
        client_user.save(update_fields=['password'])

        freelancer_user, _ = User.objects.get_or_create(
            email='freelancer@example.com',
            defaults={'full_name': 'Freelancer User', 'role': User.Role.FREELANCER},
        )
        freelancer_user.set_password('devpass123!')
        freelancer_user.save(update_fields=['password'])

        company, _ = CompanyProfile.objects.get_or_create(
            owner=client_user,
            defaults={'company_name': 'Example Client Co.'},
        )
        freelancer, _ = FreelancerProfile.objects.get_or_create(
            user=freelancer_user,
            defaults={'title': 'Full Stack Freelancer'},
        )

        project, _ = Project.objects.get_or_create(
            owner=client_user,
            title='Sample Landing Page Build',
            defaults={
                'company': company,
                'description': 'Build a responsive landing page for demo seeding.',
                'publication_status': PublicationStatus.OPEN,
            },
        )

        self.stdout.write(self.style.SUCCESS('Seed complete:'))
        self.stdout.write(f'- client: {client_user.email}')
        self.stdout.write(f'- freelancer: {freelancer_user.email}')
        self.stdout.write(f'- company profile id: {company.id}')
        self.stdout.write(f'- freelancer profile id: {freelancer.id}')
        self.stdout.write(f'- sample project id: {project.id}')
