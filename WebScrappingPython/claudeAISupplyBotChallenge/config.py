import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API keys and configurations
OPENAI_API_KEY = os.getenv('apikey')
