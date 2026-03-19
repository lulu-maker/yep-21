from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting
from wagtail.fields import StreamField
from wagtail.models import Page
from .blocks import HeroBlock, CTABlock, ContentBlock, FAQItemBlock, TestimonialItemBlock


class BaseContentPage(Page):
    body = StreamField(
        [
            ('hero', HeroBlock()),
            ('content', ContentBlock()),
            ('cta', CTABlock()),
            ('faq_item', FAQItemBlock()),
            ('testimonial', TestimonialItemBlock()),
        ],
        blank=True,
        use_json_field=True,
    )

    content_panels = Page.content_panels + [FieldPanel('body')]

    class Meta:
        abstract = True


class HomePage(BaseContentPage):
    subpage_types = ['cms.AboutPage', 'cms.BlogIndexPage', 'cms.GenericContentPage']


class AboutPage(BaseContentPage):
    parent_page_types = ['cms.HomePage']


class GenericContentPage(BaseContentPage):
    parent_page_types = ['cms.HomePage']


class BlogIndexPage(Page):
    intro = models.TextField(blank=True)

    content_panels = Page.content_panels + [FieldPanel('intro')]
    subpage_types = ['cms.BlogPostPage']
    parent_page_types = ['cms.HomePage']


class BlogPostPage(Page):
    published_date = models.DateField()
    excerpt = models.TextField(blank=True)
    body = StreamField([
        ('content', ContentBlock()),
        ('cta', CTABlock()),
    ], use_json_field=True)

    parent_page_types = ['cms.BlogIndexPage']

    content_panels = Page.content_panels + [
        FieldPanel('published_date'),
        FieldPanel('excerpt'),
        FieldPanel('body'),
    ]


@register_setting
class HeaderSettings(BaseSiteSetting):
    primary_cta_label = models.CharField(max_length=120, blank=True)
    primary_cta_url = models.URLField(blank=True)

    panels = [
        FieldPanel('primary_cta_label'),
        FieldPanel('primary_cta_url'),
    ]


@register_setting
class FooterSettings(BaseSiteSetting):
    copyright_text = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)

    panels = [
        FieldPanel('copyright_text'),
        FieldPanel('contact_email'),
    ]
