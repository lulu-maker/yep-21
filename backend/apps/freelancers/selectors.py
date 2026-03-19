from .models import FreelancerProfile


def list_public_freelancers():
    return FreelancerProfile.objects.filter(activity_status='active')
