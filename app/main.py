import os
from flask import Flask, render_template

app = Flask(__name__)
if bool(os.environ.get("DEVELOPMENT_ENV", False)):
    app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Dev-only
    app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def home():
    current_page = "Home"
    return render_template("index.html", page=current_page, highlight_id = 0)

@app.route("/links")
def links():
    current_page = "Links"
    return render_template("links.html", page=current_page, highlight_id = 1)

@app.route("/projects")
def projects():
    current_page = "Projects"
    return render_template("projects.html", page=current_page, highlight_id = 2)

@app.route("/socials")
def socials():
    current_page = "Socials"
    return render_template("socials.html", page=current_page, highlight_id = 3)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
