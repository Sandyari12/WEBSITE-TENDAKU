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


@playlist_endpoints.route('/read', methods=['GET'])
def read_msgpack():
    """Routes for module get list playlist"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    select_query = "SELECT * FROM playlist"
    cursor.execute(select_query)
    results = cursor.fetchall()
    cursor.close()  # Close the cursor after query execution

    # Convert results to msgpack format
    msgpack_data = msgpack.packb({"message": "OK", "datas": results}, 
                                 default=default_datetime_handler, use_bin_type=True)

    # Return the response with the correct MIME type for msgpack
    return Response(msgpack_data, content_type='application/x-msgpack', status=200)
    # return jsonify({"message": "OK", "datas": results}), 200

@playlist_endpoints.route('/read', methods=['GET'])
@swag_from('docs/read_playlist.yml')
@jwt_required()
def read():
    """Routes for module get list playlist"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    select_query = "SELECT * FROM playlist"
    cursor.execute(select_query)
    results = cursor.fetchall()
    cursor.close()  # Close the cursor after query execution
    return jsonify({"message": "OK", "datas": results}), 200

@playlist_endpoints.route('/read/<playlist_id>', methods=['GET'])
def read_playlist_id(playlist_id):
    """Routes for module get list playlist"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    select_query = "SELECT * FROM playlist where id_playlist = %s"
    update_query = (playlist_id, )
    cursor.execute(select_query, update_query)
    results = cursor.fetchall()
    cursor.close()  # Close the cursor after query execution
    return jsonify({"message": "OK", "datas": results}), 200


@playlist_endpoints.route('/create', methods=['POST'])
def create():
    """Routes for module create a playlist"""
    required = get_form_data(["play_name"])  # use only if the field required
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
    connection.commit()  # Commit changes to the database
    cursor.close()
    new_id = cursor.lastrowid  # Get the newly inserted playlist's ID\
    if new_id:
        return jsonify({"play_name": play_name, "message": "Inserted", "id_playlist": new_id}), 201
    return jsonify({"message": "Cant Insert Data"}), 500


@playlist_endpoints.route('/update/<playlist_id>', methods=['PUT'])
def update(playlist_id):
    """Routes for module update a playlist"""
    play_name = request.form['play_name']
    play_url = request.form['play_url']
    play_thumbnail = request.form['play_thumbnail']
    play_genre = request.form['play_genre']
    play_description = request.form['play_description']


    connection = get_connection()
    cursor = connection.cursor()

    update_query = "UPDATE playlist SET play_name=%s, play_url=%s , play_thumbnail=%s, play_genre=%s, play_description=%sWHERE id=%s"
    update_request = (play_name, play_url, play_thumbnail, play_genre, play_description, playlist_id)
    cursor.execute(update_query, update_request)
    connection.commit()
    cursor.close()
    data = {"message": "updated", "id_playlist": playlist_id}
    return jsonify(data), 200


@playlist_endpoints.route('/delete/<playlist_id>', methods=['DELETE'])
def delete(playlist_id):
    """Routes for module to delete a playlist"""
    connection = get_connection()
    cursor = connection.cursor()

    delete_query = "DELETE FROM playlist WHERE id = %s"
    delete_id = (playlist_id,)
    cursor.execute(delete_query, delete_id)
    connection.commit()
    cursor.close()
    data = {"message": "Data deleted", "id": playlist_id}
    return jsonify(data)


@playlist_endpoints.route("/upload", methods=["POST"])
def upload():
    """Routes for upload file"""
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
        uploaded_file.save(file_path)
        return jsonify({"message": "ok", "data": "uploaded", "file_path": file_path}), 200
    return jsonify({"err_message": "Can't upload data"}), 400
