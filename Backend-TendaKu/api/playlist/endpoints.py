"""Routes for module playlist"""
import os
from flask import Blueprint, jsonify, request, Response
from helper.db_helper import get_connection
from helper.form_validation import get_form_data
import msgpack
from datetime import datetime
from flasgger import swag_from
from flask_jwt_extended import jwt_required


playlist_endpoints = Blueprint('playlist', __name__)
UPLOAD_FOLDER = "img"

#pip install msgpack
def default_datetime_handler(obj):
    """Convert datetime objects to ISO format strings."""
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError("Type not serializable")


@playlist_endpoints.route('/', methods=['GET', 'POST'])
def playlist_collection():
    if request.method == 'GET':
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        select_query = "SELECT * FROM playlist"
        cursor.execute(select_query)
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify({"message": "OK", "datas": results}), 200
    elif request.method == 'POST':
        required = get_form_data(["play_name"])
        play_name = required["play_name"]
        play_url = request.form['play_url']
        play_thumbnail = request.form['play_thumbnail']
        play_genre = request.form['play_genre']
        play_description = request.form['play_description']
        connection = get_connection()
        cursor = connection.cursor()
        insert_query = "INSERT INTO playlist (play_name, play_url, play_thumbnail, play_genre, play_description) VALUES (%s, %s, %s, %s, %s)"
        request_insert = (play_name, play_url, play_thumbnail, play_genre, play_description)
        cursor.execute(insert_query, request_insert)
        connection.commit()
        cursor.close()
        connection.close()
        new_id = cursor.lastrowid
        if new_id:
            return jsonify({"play_name": play_name, "message": "Inserted", "id": new_id}), 201
        return jsonify({"message": "Cant Insert Data"}), 500

@playlist_endpoints.route('/<int:playlist_id>', methods=['GET', 'PUT', 'DELETE'])
def playlist_item(playlist_id):
    if request.method == 'GET':
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        select_query = "SELECT * FROM playlist WHERE id = %s"
        cursor.execute(select_query, (playlist_id,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        if result:
            return jsonify({"message": "OK", "data": result}), 200
        else:
            return jsonify({"message": "Not Found"}), 404
    elif request.method == 'PUT':
        play_name = request.form['play_name']
        play_url = request.form['play_url']
        play_thumbnail = request.form['play_thumbnail']
        play_genre = request.form['play_genre']
        play_description = request.form['play_description']
        connection = get_connection()
        cursor = connection.cursor()
        update_query = "UPDATE playlist SET play_name=%s, play_url=%s, play_thumbnail=%s, play_genre=%s, play_description=%s WHERE id=%s"
        update_request = (play_name, play_url, play_thumbnail, play_genre, play_description, playlist_id)
        cursor.execute(update_query, update_request)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "updated", "id": playlist_id}), 200
    elif request.method == 'DELETE':
        connection = get_connection()
        cursor = connection.cursor()
        delete_query = "DELETE FROM playlist WHERE id = %s"
        cursor.execute(delete_query, (playlist_id,))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Data deleted", "id": playlist_id}), 200


@playlist_endpoints.route("/upload", methods=["POST"])
def upload():
    """Routes for upload file"""
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
        uploaded_file.save(file_path)
        return jsonify({"message": "ok", "data": "uploaded", "file_path": file_path}), 200
    return jsonify({"err_message": "Can't upload data"}), 400
