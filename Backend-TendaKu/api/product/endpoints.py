"""Routes for module product"""
import os
from flask import Blueprint, jsonify, request, Response
from helper.db_helper import get_connection
from helper.form_validation import get_form_data
# import msgpack
from datetime import datetime
from flasgger import swag_from
from flask_jwt_extended import jwt_required


product_endpoints = Blueprint('product', __name__)
UPLOAD_FOLDER = "img"

# # #pip install msgpack
# def default_datetime_handler(obj):
#     """Convert datetime objects to ISO format strings."""
#     if isinstance(obj, datetime):
#         return obj.isoformat()
#     raise TypeError("Type not serializable")


@product_endpoints.route('/read', methods=['GET'])
@jwt_required()
def read():
    """Routes for module get list product"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    select_query = "SELECT * FROM product"
    cursor.execute(select_query)
    results = cursor.fetchall()
    cursor.close()  # Close the cursor after query execution
    return jsonify({"message": "OK", "datas": results}), 200

# @product_endpoints.route('/read', methods=['GET'])
# @swag_from('docs/read_product.yml')
# @jwt_required()
# def read():
#     """Routes for module get list product"""
#     connection = get_connection()
#     cursor = connection.cursor(dictionary=True)
#     select_query = "SELECT * FROM product"
#     cursor.execute(select_query)
#     results = cursor.fetchall()
#     cursor.close()  # Close the cursor after query execution
#     return jsonify({"message": "OK", "datas": results}), 200

@product_endpoints.route('/read/<product_id>', methods=['GET'])
def read_product_id(product_id):
    """Routes for module get list product"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    select_query = "SELECT * FROM product where id_product = %s"
    update_query = (product_id, )
    cursor.execute(select_query, update_query)
    results = cursor.fetchall()
    cursor.close()  # Close the cursor after query execution
    return jsonify({"message": "OK", "datas": results}), 200


@product_endpoints.route('/create', methods=['POST'])
def create():
    """Routes for module create a product"""
    required = get_form_data(["name"])  # use only if the field required
    name = required["name"]
    category = request.form['category']
    price = request.form['price']
    stock = request.form['stock']
    image = request.form('image')
    description = request.form['description']

    # image_path = None
    # if image:
    #     if image.filename == '' or not allowed_file(image.filename):
    #         return jsonify({"err_message": "Invalid file format"}), 400
    #     if len(image.read()) > MAX_FILE_SIZE:
    #         return jsonify({"err_message": "File is too large"}), 400
    #     image.seek(0)  # Reset the file pointer after checking size
    #     image_path = os.path.join(UPLOAD_FOLDER, image.filename)
    #     image.save(image_path)

    connection = get_connection()
    cursor = connection.cursor()
    insert_query = "INSERT INTO product (name, category, price, stock, image,description) VALUES (%s, %s, %s, %s, %s, %s)"
    request_insert = (name, category, price, stock, image, description)
    cursor.execute(insert_query, request_insert)
    connection.commit()  # Commit changes to the database
    cursor.close()
    new_id = cursor.lastrowid  # Get the newly inserted product's ID\
    if new_id:
        return jsonify({"name": name, "message": "Inserted", "id_product": new_id, "image": image_path}), 201
    return jsonify({"message": "Cant Insert Data"}), 500


@product_endpoints.route('/update/<product_id>', methods=['PUT'])
def update(product_id):
    """Routes for module update a product"""
    name = request.form['name']
    category = request.form['category']
    price = request.form['price']
    stock = request.form['stock']
    image = request.form('image')
    description = request.form['description']


    connection = get_connection()
    cursor = connection.cursor()

    update_query = "UPDATE product SET name=%s, category=%s , price=%s, stock=%s, image=%s, description=%s WHERE id=%s"
    update_request = (name, category, price, stock, image,description, product_id)
    cursor.execute(update_query, update_request)
    connection.commit()
    cursor.close()
    data = {"message": "updated", "id_product": product_id}
    return jsonify(data), 200


@product_endpoints.route('/delete/<product_id>', methods=['DELETE'])
def delete(product_id):
    """Routes for module to delete a product"""
    connection = get_connection()
    cursor = connection.cursor()

    delete_query = "DELETE FROM product WHERE id = %s"
    delete_id = (product_id,)
    cursor.execute(delete_query, delete_id)
    connection.commit()
    cursor.close()
    data = {"message": "Data deleted", "id": product_id}
    return jsonify(data)


@product_endpoints.route("/upload", methods=["POST"])
def upload():
    """Routes for upload file"""
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
        uploaded_file.save(file_path)
        return jsonify({"message": "ok", "data": "uploaded", "file_path": file_path}), 200
    return jsonify({"err_message": "Can't upload data"}), 400
