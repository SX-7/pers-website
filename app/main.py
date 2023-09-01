import os
from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello():
    return "hellow World?!??!"


if __name__ == "main":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
