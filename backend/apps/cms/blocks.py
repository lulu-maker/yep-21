from wagtail import blocks


class HeroBlock(blocks.StructBlock):
    eyebrow = blocks.CharBlock(required=False)
    title = blocks.CharBlock(required=True)
    subtitle = blocks.TextBlock(required=False)
    cta_label = blocks.CharBlock(required=False)
    cta_url = blocks.URLBlock(required=False)


class CTABlock(blocks.StructBlock):
    title = blocks.CharBlock()
    body = blocks.TextBlock(required=False)
    button_label = blocks.CharBlock(required=False)
    button_url = blocks.URLBlock(required=False)


class ContentBlock(blocks.StructBlock):
    heading = blocks.CharBlock(required=False)
    content = blocks.RichTextBlock()


class FAQItemBlock(blocks.StructBlock):
    question = blocks.CharBlock()
    answer = blocks.RichTextBlock()


class TestimonialItemBlock(blocks.StructBlock):
    quote = blocks.TextBlock()
    author = blocks.CharBlock()
    role = blocks.CharBlock(required=False)
