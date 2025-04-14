import scrapy
import logging
from scrapy.crawler import CrawlerProcess
from urllib.parse import urljoin

class InstacartSpider(scrapy.Spider):
    """
    A Scrapy spider to scrape product information from Instacart, specifically
    looking for products that contain a given raw material as an ingredient.
    """
    name = 'instacart_products'  # Unique name for the spider
    #allowed_domains = ['www.instacart.com'] #  <--  We'll set start_urls dynamically
    start_urls = []  #  <--  Will be populated from Streamlit

    raw_material_to_find = ''  #  <--  Will be set from Streamlit
    #custom_settings = {
    #    'LOG_LEVEL': logging.INFO,  # Reduce verbosity
    #}

    def __init__(self, *args, **kwargs):
        """
        Initializes the spider with data passed from our Streamlit application.
        """
        super().__init__(*args, **kwargs)
        self.start_urls = [kwargs.get('url')]  # Get URL from Streamlit
        self.raw_material_to_find = kwargs.get('raw_material')  # Get raw material
        if not self.start_urls[0]:
            raise ValueError("A start URL must be provided.")
        if not self.raw_material_to_find:
            raise ValueError("A raw material to search for must be provided.")
        self.allowed_domains = [scrapy.utils.url.parse_domain(self.start_urls[0])] #Dynamically set allowed domain

    def parse(self, response):
        """
        Parses the initial category page.  This will find product URLs.
        """
        # Example: Find product links.  This is VERY website-specific and might need LOTS of tweaking.
        #  Instacart's structure is complex, so this is just a starting point.
        product_links = response.css('a.e5c086f6::attr(href)').getall()  #  <--  Find product links
        for link in product_links:
            #  Important:  Use urljoin to make the URLs absolute.
            absolute_url = urljoin(response.url, link)
            yield scrapy.Request(absolute_url, callback=self.parse_product_page)

        # Pagination (if needed):  Find the link to the next page.  Again, VERY website-specific.
        # next_page = response.css('a.next-page::attr(href)').get()
        # if next_page:
        #     yield scrapy.Request(next_page, callback=self.parse)

    def parse_product_page(self, response):
        """
        Parses individual product pages to find ingredients and manufacturer.
        """
        # 1. Extract product name
        product_name = response.css('h1.e2965042::text').get()  # Example CSS selector
        if not product_name:
            return  # Product name not found, skip

        # 2. Extract ingredients.  This is the trickiest part, as ingredient lists
        #    can be in different formats.  You'll need to inspect the Instacart
        #    HTML carefully and adjust the CSS selectors accordingly.
        ingredients_text = response.css('div.ingredients ::text').get()  # Example
        if not ingredients_text:
            return

        # 3. Check for the raw material (case-insensitive)
        if self.raw_material_to_find.lower() in ingredients_text.lower():
            # 4. Extract manufacturer.  Again, VERY website-specific.
            manufacturer = response.css('span.product-manufacturer::text').get() # Example
            if not manufacturer:
                manufacturer = "Manufacturer Not Found"

            # Yield the result (a Python dictionary)
            yield {
                'product_name': product_name,
                'ingredients': ingredients_text,
                'manufacturer': manufacturer,
                'product_url': response.url,  # Include the URL for reference
            }
