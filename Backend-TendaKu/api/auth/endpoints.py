"""Routes for module books"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, decode_token
from flask_bcrypt import Bcrypt
from helper.db_helper import get_connection
import json

bcrypt = Bcrypt()
auth_endpoints = Blueprint('auth', __name__)


@auth_endpoints.route('/login', methods=['POST'])
def login():
    """Routes for authentication"""
    print("DEBUG request.form:", request.form)
    username = request.form['username']
    password = request.form['password']

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM user WHERE username = %s"
    cursor.execute(query, (username,))
    user = cursor.fetchone()
    cursor.close()

    if not user or not bcrypt.check_password_hash(user.get('password'), password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(
        identity=json.dumps({'id': user['id'], 'role': user['roles']}))
    decoded_token = decode_token(access_token)
    expires = decoded_token['exp']

    return jsonify({
        "access_token": access_token,
        "expires_in": expires,
        "type": "Bearer",
        "user": {
            "id": user['id'],
            "username": user['username'],
            "role": user['roles']
        }
    })


@auth_endpoints.route('/register', methods=['POST'])
def register():
    """Routes for register"""
    username = request.form['username']
    password = request.form['password']
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    connection = get_connection()
    cursor = connection.cursor()
    insert_query = "INSERT INTO user (username, password, roles) values (%s, %s, %s)"
    roles = request.form.get('roles', 'user')
    request_insert = (username, hashed_password, roles)
    cursor.execute(insert_query, request_insert)
    connection.commit()
    new_id = cursor.lastrowid
    cursor.close()

    if new_id:
        return jsonify({"message": "OK",
                        "description": "User created",
                        "username": username}), 201
    return jsonify({"message": "Failed, cant register user"}), 501
