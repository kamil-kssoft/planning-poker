import datetime
import json
import threading
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
from memory_storage_service import MemoryStorageService

CONTROLLER = "/"
SESSION_ROUTE = f"{CONTROLLER}<session_id>"

storage = MemoryStorageService()

app = Flask("playing-poker")
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", engineio_logger=True, logger=True)

lock = threading.Lock()


@app.errorhandler(ValueError)
def handle_value_error(error):
    return jsonify({"error": str(error)}), 400


@app.route(f"/ping", methods=["GET"])
def get() -> dict:
    return jsonify("pong"), 200


@app.route(f"{CONTROLLER}", methods=["POST"])
def create_session() -> str:
    data = request.get_json()
    with lock:
        session_id = storage.create_session(
            data['name'] if 'name' in data else None,
            datetime.datetime.now() + datetime.timedelta(hours=2)
        )
    return jsonify(session_id), 201


@app.route(f"{SESSION_ROUTE}", methods=["GET"])
def get_session(session_id: str) -> dict:
    return jsonify(storage.get_session(session_id)), 200


@app.route(f"{SESSION_ROUTE}/player", methods=["POST"])
def add_player(session_id: str):
    data = request.get_json()
    with lock:
        storage.add_player(session_id, data["name"], data["type"])
    _send_notification(session_id)
    return "", 201


@app.route(f"{SESSION_ROUTE}/game", methods=["POST"])
def create_game(session_id: str) -> None:
    data = request.get_json()
    with lock:
        storage.create_game(session_id, data["name"])
    _send_notification(session_id)
    return "", 201


@app.route(f"{SESSION_ROUTE}/game/title", methods=["POST"])
def set_title(session_id: str):
    data = request.get_json()
    with lock:
        storage.set_title(session_id, data["title"])
    _send_notification(session_id)
    return "", 200


@app.route(f"{SESSION_ROUTE}/game/score", methods=["POST"])
def add_score(session_id: str):
    data = request.get_json()
    with lock:
        storage.add_score(session_id, data["user_name"], data["score"])
    _send_notification(session_id)
    return "", 201


@app.route(f"{SESSION_ROUTE}/game/score", methods=["GET"])
def get_scores(session_id: str) -> dict:
    return jsonify(storage.get_scores(session_id), False), 200


@app.route(f"{SESSION_ROUTE}/game/reveal", methods=["POST"])
def reveal_scores(session_id: str) -> dict:
    with lock:
        storage.reveal_scores(session_id)
    _send_notification(session_id)
    return "", 200


def datetime_converter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()


def _send_notification(session_id: str):
    payload = storage.get_session(session_id)
    json_data = json.dumps(payload, default=datetime_converter)
    with lock:
        socketio.emit(session_id, json.loads(json_data))


if __name__ == "__main__":
    socketio.run(app, debug=True)
