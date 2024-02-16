from copy import deepcopy
import datetime
from uuid import uuid4


class MemoryStorageService:

    def __init__(self):
        self._storage = {}

    def _assert_session_exists(self, session_id: str):
        if session_id not in self._storage:
            raise ValueError(f"Session {session_id} does not exist")

    def _assert_game_exists(self, session_id: str):
        self._assert_session_exists(session_id)
        game_id = self._storage[session_id]["active_game"]
        if game_id not in self._storage[session_id]["games"]:
            raise ValueError(f"There is no active game in current session")

    def _assert_user_exists(self, session_id: str, user_name: str):
        self._assert_session_exists(session_id)
        if user_name not in self._storage[session_id]["users"]:
            raise ValueError(f"User {user_name} does not exist")

    def create_session(self, name: str, expired_at: datetime.datetime) -> str:
        session_id = name or str(uuid4())
        if session_id in self._storage.keys():
            return session_id
        self._storage[session_id] = {
            "expired_at": expired_at,
            "users": {},
            "active_game": None,
            "games": {},
        }
        return session_id

    def add_player(self, session_id: str, user_name: str, user_type: str):
        self._assert_session_exists(session_id)
        if user_name in self._storage[session_id]["users"]:
            return
        self._storage[session_id]["users"][user_name] = user_type

    def create_game(self, session_id: str, game_name: str = "") -> None:
        self._assert_session_exists(session_id)
        game_id = str(uuid4())
        self._storage[session_id]["active_game"] = game_id
        self._storage[session_id]["games"][game_id] = {
            "name": game_name,
            "hidden": True,
            "scores": {},
        }

    def set_title(self, session_id: str, title: str):
        self._assert_game_exists(session_id)
        game_id = self._storage[session_id]["active_game"]
        self._storage[session_id]["games"][game_id]["name"] = title

    def add_score(self, session_id: str, user_name: str, score: int):
        self._assert_game_exists(session_id)
        self._assert_user_exists(session_id, user_name)
        game_id = self._storage[session_id]["active_game"]
        user_type = self._storage[session_id]["users"][user_name]
        scores_container = self._storage[session_id]["games"][game_id]["scores"]
        if user_type not in scores_container:
            scores_container[user_type] = {}

        scores_container[user_type][user_name] = score

    def get_scores(self, session_id: str) -> dict:
        self._assert_game_exists(session_id)
        game_id = self._storage[session_id]["active_game"]
        current_game = self._storage[session_id]["games"][game_id]
        scores = current_game["scores"]
        if current_game["hidden"]:
            return {
                user_type: {user: None for user in scores[user_type]}
                for user_type in scores
            }

        return scores

    def reveal_scores(self, session_id: str) -> dict:
        self._assert_game_exists(session_id)
        game_id = self._storage[session_id]["active_game"]
        self._storage[session_id]["games"][game_id]["hidden"] = False

    def get_session(self, session_id: str) -> dict:
        self._assert_session_exists(session_id)
        response = deepcopy(self._storage[session_id])
        response["id"] = str(session_id)

        for game_id, game in response["games"].items():
            scores = game["scores"]
            if game["hidden"]:
                response["games"][game_id]["scores"] = {
                    user_type: {user: None for user in scores[user_type]}
                    for user_type in scores
                }

        return response
