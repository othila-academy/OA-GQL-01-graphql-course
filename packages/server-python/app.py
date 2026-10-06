import os

from server import create_app

app = create_app()

if __name__ == "__main__":
    # Sur macOS le port 5000 est parfois pris par AirPlay : PORT=5001 python app.py
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")))
