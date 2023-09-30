import os
from flask import Flask, render_template, redirect
import yaml

file_prefix=""
app = Flask(__name__)
if bool(os.environ.get("DEVELOPMENT_ENV", False)):
    app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Dev-only
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    file_prefix="app/"
with open(file_prefix+'templates/data/projects/index.yaml', 'r') as file:
    project_file_data = yaml.safe_load(file)
with open(file_prefix+'static/links/index.yaml', 'r') as file:
    links_data = yaml.safe_load(file)
    
@app.route("/")
def home():
    current_page = "Home"
    return render_template("index.html", page=current_page, id=0)


@app.route("/links")
def links():
    current_page = "Links"
    return render_template("links.html", page=current_page, id=1, links=links_data)


@app.route("/projects")
def projects():
    current_page = "Projects"
    return render_template("projects.html", page=current_page, id=2, projects=project_file_data)


@app.route("/socials")
def socials():
    current_page = "Socials"
    return render_template("socials.html", page=current_page, id=3)


@app.route("/quartz")
def quartz():
    return redirect("https://quartz.sx7.dev")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
