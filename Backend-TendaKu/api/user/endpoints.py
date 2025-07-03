import os
from flask import Blueprint, jsonify, request
from helper.db_helper import get_connection
from helper.form_validation import get_form_data
from flask_jwt_extended import jwt_required
from flask_bcrypt import Bcrypt

user_endpoints = Blueprint('user', __name__)
UPLOAD_FOLDER = "img"
bcrypt = Bcrypt()

@user_endpoints.route('/read', methods=['GET'])
@jwt_required()
def read_users():
    """Ambil semua data user (kecuali password)"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    select_query = "SELECT id, name, username, roles FROM user"
    cursor.execute(select_query)
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify({"message": "OK", "datas": results}), 200

@user_endpoints.route('/create', methods=['POST'])
# @jwt_required()
def create_user():
    """Tambah user baru (name, username, password, roles)"""
    name = request.form.get('name')
    username = request.form.get('username')
    password = request.form.get('password')
    roles = request.form.get('roles', 'user')  # default user
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    connection = get_connection()
    cursor = connection.cursor()
    insert_query = "INSERT INTO user (name, username, password, roles) VALUES (%s, %s, %s, %s)"
    request_insert = (name, username, password_hash, roles)
    cursor.execute(insert_query, request_insert)
    connection.commit()
    cursor.close()
    connection.close()
    new_id = cursor.lastrowid
    if new_id:
        return jsonify({"username": username, "message": "Inserted", "user_id": new_id}), 201
    return jsonify({"message": "Cant Insert Data"}), 500

@user_endpoints.route('/update/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update data user (name, username, password, roles)"""
    name = request.form.get('name')
    username = request.form.get('username')
    password = request.form.get('password')
    roles = request.form.get('roles')

    connection = get_connection()
    cursor = connection.cursor()
    if password:
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        update_query = "UPDATE user SET name=%s, username=%s, password=%s, roles=%s WHERE id=%s"
        update_request = (name, username, password_hash, roles, user_id)
    else:
        update_query = "UPDATE user SET name=%s, username=%s, roles=%s WHERE id=%s"
        update_request = (name, username, roles, user_id)
    cursor.execute(update_query, update_request)
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "updated", "user_id": user_id}), 200

@user_endpoints.route('/delete/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Hapus user"""
    connection = get_connection()
    cursor = connection.cursor()
    delete_query = "DELETE FROM user WHERE id = %s"
    cursor.execute(delete_query, (user_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Data deleted", "user_id": user_id})

@user_endpoints.route('/read_by_role/<role>', methods=['GET'])
@jwt_required()
def read_by_role(role):
    """Ambil user berdasarkan role"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    select_query = "SELECT id, name, email, phone, role FROM user WHERE role = %s"
    cursor.execute(select_query, (role,))
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify({"message": "OK", "datas": results}), 200

@user_endpoints.route('/count_by_role/<role>', methods=['GET'])
@jwt_required()
def count_users_by_role(role):
    """Hitung jumlah user berdasarkan role"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    count_query = "SELECT COUNT(*) AS total_users FROM user WHERE role = %s"
    cursor.execute(count_query, (role,))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return jsonify({"message": "OK", "role": role, "total_users": result['total_users']}), 200

@user_endpoints.route("/upload", methods=["POST"])
@jwt_required()
def upload():
    """Upload file user (misal foto profil)"""
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
        uploaded_file.save(file_path)
        return jsonify({"message": "ok", "data": "uploaded", "file_path": file_path}), 200
    return jsonify({"err_message": "Can't upload data"}), 400