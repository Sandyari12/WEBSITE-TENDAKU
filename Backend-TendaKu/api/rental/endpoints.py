"""Routes for module rental"""
import os
from flask import Blueprint, jsonify, request, Response
from helper.db_helper import get_connection
from helper.form_validation import get_form_data
# import msgpack
from datetime import datetime
from flasgger import swag_from
from flask_jwt_extended import jwt_required, get_jwt_identity
import json


rental_endpoints = Blueprint('rental', __name__)
UPLOAD_FOLDER = "img"

# # #pip install msgpack
# def default_datetime_handler(obj):
#     """Convert datetime objects to ISO format strings."""
#     if isinstance(obj, datetime):
#         return obj.isoformat()
#     raise TypeError("Type not serializable")


@rental_endpoints.route('/read', methods=['GET'])
@jwt_required()
def read():
    """Routes for module get list rental"""
    user = get_jwt_identity()
    if isinstance(user, str):
        user = json.loads(user)
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        if user['role'] == 'admin':
            cursor.execute("SELECT * FROM rental")
        else:
            cursor.execute("SELECT * FROM rental WHERE user_id = %s", (user['id'],))
        results = cursor.fetchall()
        return jsonify({"message": "OK", "datas": results}), 200
    finally:
        cursor.close()
        connection.close()

# @rental_endpoints.route('/read', methods=['GET'])
# @swag_from('docs/read_rental.yml')
# @jwt_required()
# def read():
#     """Routes for module get list rental"""
#     connection = get_connection()
#     cursor = connection.cursor(dictionary=True)
#     select_query = "SELECT * FROM rental"
#     cursor.execute(select_query)
#     results = cursor.fetchall()
#     cursor.close()  # Close the cursor after query execution
#     return jsonify({"message": "OK", "datas": results}), 200

@rental_endpoints.route('/read/<rental_id>', methods=['GET'])
def read_rental_id(rental_id):
    """Routes for module get list rental"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    select_query = "SELECT * FROM rental where id_rental = %s"
    update_query = (rental_id, )
    cursor.execute(select_query, update_query)
    results = cursor.fetchall()
    cursor.close()  # Close the cursor after query execution
    return jsonify({"message": "OK", "datas": results}), 200


@rental_endpoints.route('/create', methods=['POST'])
@jwt_required()
def create():
    """Routes for module create a rental"""
    user = get_jwt_identity()
    if isinstance(user, str):
        user = json.loads(user)
    required = get_form_data(["name"])
    name = required["name"]
    email = request.form['email']
    phone = request.form['phone']
    address = request.form['address']
    

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
    try:
        insert_query = "INSERT INTO rental (user_id, name, email, phone, address) VALUES (%s, %s, %s, %s, %s)"
        request_insert = (user['id'], name, email, phone, address)
        cursor.execute(insert_query, request_insert)
        connection.commit()
        new_id = cursor.lastrowid
        if new_id:
            return jsonify({"name": name, "message": "Inserted", "id_rental": new_id}), 201
        return jsonify({"message": "Cant Insert Data"}), 500
    finally:
        cursor.close()
        connection.close()


@rental_endpoints.route('/update/<rental_id>', methods=['PUT'])
@jwt_required()
def update(rental_id):
    """Routes for module update a rental"""
    user = get_jwt_identity()
    if isinstance(user, str):
        user = json.loads(user)
    if user['role'] != 'admin':
        return jsonify({"message": "Unauthorized"}), 403
    name = request.form['name']
    email = request.form['email']
    phone = request.form['phone']
    address = request.form['address']
    


    connection = get_connection()
    cursor = connection.cursor()
    try:
        update_query = "UPDATE rental SET name=%s, email=%s , phone=%s, address=%s WHERE id=%s"
        update_request = (name, email, phone, address, rental_id)
        cursor.execute(update_query, update_request)
        connection.commit()
        data = {"message": "updated", "id_rental": rental_id}
        return jsonify(data), 200
    finally:
        cursor.close()
        connection.close()


@rental_endpoints.route('/delete/<rental_id>', methods=['DELETE'])
@jwt_required()
def delete(rental_id):
    """Routes for module to delete a rental"""
    user = get_jwt_identity()
    if isinstance(user, str):
        user = json.loads(user)
    if user['role'] != 'admin':
        return jsonify({"message": "Unauthorized"}), 403
    connection = get_connection()
    cursor = connection.cursor()
    try:
        delete_query = "DELETE FROM rental WHERE id = %s"
        delete_id = (rental_id,)
        cursor.execute(delete_query, delete_id)
        connection.commit()
        data = {"message": "Data deleted", "id": rental_id}
        return jsonify(data)
    finally:
        cursor.close()
        connection.close()


@rental_endpoints.route("/upload", methods=["POST"])
def upload():
    """Routes for upload file"""
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
        uploaded_file.save(file_path)
        return jsonify({"message": "ok", "data": "uploaded", "file_path": file_path}), 200
    return jsonify({"err_message": "Can't upload data"}), 400
