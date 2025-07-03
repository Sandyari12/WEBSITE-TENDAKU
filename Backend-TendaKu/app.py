"""Small apps to demonstrate endpoints with basic feature - CRUD"""

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import jwt
# from api.books.endpoints import books_endpoints
from api.playlist.endpoints import playlist_endpoints
from api.product.endpoints import product_endpoints
from api.user.endpoints import user_endpoints
from api.auth.endpoints import auth_endpoints
from api.rental.endpoints import rental_endpoints
from api.rental_item.endpoints import rental_item_endpoints
from api.data_protected.endpoints import protected_endpoints
# from api.authors.endpoints import authors_endpoints

from config import Config
from static.static_file_server import static_file_server
from flasgger import Swagger


# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)


Swagger(app)


jwt.init_app(app)

# register the blueprint
app.register_blueprint(auth_endpoints, url_prefix='/api/v1/auth')
app.register_blueprint(protected_endpoints,
                       url_prefix='/api/v1/protected')
app.register_blueprint(playlist_endpoints, url_prefix='/api/v1/playlist')
app.register_blueprint(user_endpoints, url_prefix='/api/v1/user')
app.register_blueprint(product_endpoints, url_prefix='/api/v1/product')
app.register_blueprint(rental_endpoints, url_prefix='/api/v1/rental')
app.register_blueprint(rental_item_endpoints, url_prefix='/api/v1/rental_item')
app.register_blueprint(static_file_server, url_prefix='/static/')


if __name__ == '__main__':
    app.run(debug=True)
