"""Routes for module rental_item"""
import os
from flask import Blueprint, jsonify, request, Response
from helper.db_helper import get_connection
from helper.form_validation import get_form_data
# import msgpack
from datetime import datetime
from flasgger import swag_from
from flask_jwt_extended import jwt_required


rental_item_endpoints = Blueprint('rental_item', __name__)
UPLOAD_FOLDER = "img"

# # #pip install msgpack
# def default_datetime_handler(obj):
#     """Convert datetime objects to ISO format strings."""
#     if isinstance(obj, datetime):
#         return obj.isoformat()
#     raise TypeError("Type not serializable")


@rental_item_endpoints.route('/read', methods=['GET'])
@jwt_required()
def read():
    rental_id = request.args.get('rental_id')
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    if rental_id:
        query = '''
            SELECT ri.*, p.name as product_name
            FROM rental_item ri
            JOIN product p ON ri.product_id = p.id
            WHERE ri.rental_id = %s
        '''
        cursor.execute(query, (rental_id,))
    else:
        query = '''
            SELECT ri.*, p.name as product_name
            FROM rental_item ri
            JOIN product p ON ri.product_id = p.id
        '''
        cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify({"message": "OK", "datas": results}), 200

# @rental_item_endpoints.route('/read', methods=['GET'])
# @swag_from('docs/read_rental_item.yml')
# @jwt_required()
# def read():
#     """Routes for module get list rental_item"""
#     connection = get_connection()
#     cursor = connection.cursor(dictionary=True)
#     select_query = "SELECT * FROM rental_item"
#     cursor.execute(select_query)
#     results = cursor.fetchall()
#     cursor.close()  # Close the cursor after query execution
#     return jsonify({"message": "OK", "datas": results}), 200

@rental_item_endpoints.route('/read/<rental_item_id>', methods=['GET'])
def read_rental_item_id(rental_item_id):
    """Routes for module get list rental_item"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    select_query = "SELECT * FROM rental_item where id_rental_item = %s"
    update_query = (rental_item_id, )
    cursor.execute(select_query, update_query)
    results = cursor.fetchall()
    cursor.close()  # Close the cursor after query execution
    return jsonify({"message": "OK", "datas": results}), 200


@rental_item_endpoints.route('/create', methods=['POST'])
def create():
    """Routes for module create a rental_item"""
    required = get_form_data(["rental_id"])  # use only if the field required
    rental_id = required["rental_id"]
    product_id = request.form['product_id']
    quantity = int(request.form['quantity'])
    rental_days = request.form['rental_days']
    price = request.form['price']

    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Cek stok produk cukup
        cursor.execute("SELECT stock FROM product WHERE id = %s", (product_id,))
        result = cursor.fetchone()
        if not result or result[0] < quantity:
            return jsonify({"message": "Stok produk tidak mencukupi"}), 400

        # Insert rental_item
        insert_query = "INSERT INTO rental_item (rental_id, product_id, quantity, rental_days, price) VALUES (%s, %s, %s, %s, %s)"
        request_insert = (rental_id, product_id, quantity, rental_days, price)
        cursor.execute(insert_query, request_insert)
        connection.commit()  # Commit changes to the database
        new_id = cursor.lastrowid  # Get the newly inserted rental_item's ID

        # Kurangi stok produk
        update_stock_query = "UPDATE product SET stock = stock - %s WHERE id = %s"
        cursor.execute(update_stock_query, (quantity, product_id))
        connection.commit()
        if new_id:
            return jsonify({"rental_id": rental_id, "message": "Inserted", "id": new_id}), 201
        return jsonify({"message": "Cant Insert Data"}), 500
    finally:
        cursor.close()
        connection.close()


@rental_item_endpoints.route('/update/<rental_item_id>', methods=['PUT'])
def update(rental_item_id):
    """Routes for module update a rental_item"""
    rental_id = request.form['rental_id']
    product_id = request.form['product_id']
    quantity = request.form['quantity']
    rental_days = request.form['rental_days']
    price = request.form['price']


    connection = get_connection()
    cursor = connection.cursor()

    update_query = "UPDATE rental_item SET rental_id=%s, product_id=%s, quantity=%s, rental_days=%s, price=%s WHERE id=%s"
    update_request = (rental_id, product_id, quantity, rental_days, price, rental_item_id)
    cursor.execute(update_query, update_request)
    connection.commit()
    cursor.close()
    data = {"message": "updated", "id_rental_item": rental_item_id}
    return jsonify(data), 200


@rental_item_endpoints.route('/delete/<rental_item_id>', methods=['DELETE'])
def delete(rental_item_id):
    """Routes for module to delete a rental_item"""
    connection = get_connection()
    cursor = connection.cursor()

    delete_query = "DELETE FROM rental_item WHERE id = %s"
    delete_id = (rental_item_id,)
    cursor.execute(delete_query, delete_id)
    connection.commit()
    cursor.close()
    data = {"message": "Data deleted", "id": rental_item_id}
    return jsonify(data)


@rental_item_endpoints.route("/upload", methods=["POST"])
def upload():
    """Routes for upload file"""
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
        uploaded_file.save(file_path)
        return jsonify({"message": "ok", "data": "uploaded", "file_path": file_path}), 200
    return jsonify({"err_message": "Can't upload data"}), 400
