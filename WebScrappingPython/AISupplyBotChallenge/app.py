import streamlit as st
import json
import os
from urllib.parse import urljoin, urlparse
import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.spiders import Spider
import logging
import asyncio
from twisted.internet import reactor, defer
from twisted.internet.asyncioreactor import AsyncioReactor

# Install the asyncio reactor
try:
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())  # For Windows
except AttributeError:
    pass  # Assume we're on a platform where this isn't needed



class InstacartSpider(scrapy.Spider):
    """
    A Scrapy spider to scrape product information from Instacart.
    """
    name = 'instacart_products'
    start_urls = []
    raw_material_to_find = ''
    custom_settings = {
        'LOG_LEVEL': logging.INFO,
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.start_urls = [kwargs.get('url')]
        self.raw_material_to_find = kwargs.get('raw_material')
        if not self.start_urls[0]:
            raise ValueError("A start URL must be provided.")
        if not self.raw_material_to_find:
            raise ValueError("A raw material to search for must be provided.")
        self.allowed_domains = [urlparse(self.start_urls[0]).netloc]

    def parse(self, response):
        """
        Parses the initial category page.
        """
        st.info(f"Scraping URL: {response.url}")
        product_links = response.css('a::attr(href)').getall()
        if not product_links:
            st.warning(f"No product links found on {response.url}")
            return

        for link in product_links:
            absolute_url = urljoin(response.url, link)
            yield scrapy.Request(absolute_url, callback=self.parse_product_page)



    def parse_product_page(self, response):
        """
        Parses individual product pages.
        """
        st.info(f"Scraping product page: {response.url}")
        product_name = response.css('h1::text').get()
        if not product_name:
            st.warning(f"Product name not found on {response.url}")
            return

        ingredients_text = response.css('body ::text').get()
        if not ingredients_text:
            st.warning(f"Ingredients not found on {response.url}")
            return

        if self.raw_material_to_find.lower() in ingredients_text.lower():
            manufacturer = response.css('span::text').get()
            if not manufacturer:
                manufacturer = "Manufacturer Not Found"

            yield {
                'product_name': product_name,
                'ingredients': ingredients_text,
                'manufacturer': manufacturer,
                'product_url': response.url,
            }


def run_scrapy_spider(url, raw_material, category):
    """
    Runs the Scrapy spider, ensuring the reactor is properly handled.

    Args:
        url (str): The URL to scrape.
        raw_material (str): The raw material to search for.
        category (str): The category being scraped.

    Returns:
        list: A list of scraped product dictionaries.
    """
    results = []
    event_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(event_loop)
    try:
        def run_spider():
            process = CrawlerProcess(
                reactor=AsyncioReactor(eventloop=event_loop),  # Use AsyncioReactor
                settings={
                    'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'LOG_LEVEL': logging.INFO,
                    'FEEDS': {
                        "data.json": {"format": "json"},
                    },
                }
            )

            def item_scraped(item):
                results.append(item)

            dfd = process.crawl(InstacartSpider, url=url, raw_material=raw_material)

            def on_complete(_):  # Define a callback function
                try:
                    with open("data.json", "r") as f:
                        results.extend(json.load(f))
                except FileNotFoundError:
                    st.warning("data.json not found.")
                except json.JSONDecodeError:
                    st.error("Error decoding JSON from data.json.")
                finally:
                    process.stop()

            dfd.addCallback(on_complete)  # Add the callback
            return dfd  # Return the Deferred

        event_loop.run_until_complete(asyncio.ensure_future(run_spider()))

        return results
    except Exception as e:
        st.error(f"Error running Scrapy: {e}")
        st.error(f"Exception type: {type(e)}")
        st.error(f"Exception args: {e.args}")
        return []
    finally:
        try:
            if os.path.exists("data.json"):
                os.remove("data.json")
                st.info("data.json removed")
        except OSError as e:
            st.error(f"Error removing data.json: {e}")
        finally:
            event_loop.close()



def main():
    """
    Main function to set up the Streamlit UI and run the Scrapy spider.
    """
    # Set the title of the Streamlit app
    st.title("Raw Material to E-commerce Data Extractor")

    # Create a text input box for the user to enter the raw material
    raw_material = st.text_input("Enter the raw material you want to sell:", "salt")
    # Create a text input box for the user to enter the e-commerce website URL
    ecommerce_url = st.text_input("Enter the e-commerce website URL (e.g., www.instacart.com):",
                                 "https://www.instacart.com")
    # Create a text input box for the user to enter the categories manually, comma-separated
    categories_input = st.text_input(
        "Enter the e-commerce categories to search (comma-separated):",
        "Produce, Pantry, Beverages"
    )

    # Create a button to trigger the processing
    if st.button("Start Processing"):
        # Basic input validation
        if not raw_material:
            st.error("Please enter a raw material.")
        elif not ecommerce_url:
            st.error("Please enter an e-commerce website URL.")
        elif not categories_input:
            st.error("Please enter at least one category.")
        else:
            # Parse the comma-separated categories into a list
            categories = [cat.strip() for cat in categories_input.split(',')]

            # Display a message while processing
            st.info("Processing... (Starting web scraping...)")

            # Store the raw material, URL, and categories in session state
            st.session_state.raw_material = raw_material
            st.session_state.ecommerce_url = ecommerce_url
            st.session_state.categories = categories

            # Display the inputs (for verification)
            st.write(f"Raw Material: {raw_material}")
            st.write(f"E-commerce URL: {ecommerce_url}")
            st.write(f"Categories: {categories}")

            all_results = []
            # Iterate through each category and run the spider.
            for category in categories:
                st.info(f"Scraping category: {category}")
                results_for_category = run_scrapy_spider(ecommerce_url, raw_material, category) # change
                if results_for_category:
                    all_results.extend(results_for_category)

            if all_results:
                st.write("Scraping complete. Results:")
                st.json(all_results)
                st.session_state.scraped_data = all_results
            else:
                st.warning("No products found matching the raw material in the specified categories.")
                st.session_state.scraped_data = []


if __name__ == "__main__":
    main()
