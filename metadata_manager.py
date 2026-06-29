import json
import os
from datetime import datetime

FILE = "metadata.json"


def load_metadata():

    if not os.path.exists(FILE):

        return {}

    with open(FILE, "r") as f:

        return json.load(f)


def save_metadata(data):

    with open(FILE, "w") as f:

        json.dump(data, f, indent=4)


def add_document(filename):

    data = load_metadata()

    data[filename] = {

        "upload_date": datetime.now().strftime("%d %b %Y %I:%M %p")

    }

    save_metadata(data)


def remove_document(filename):

    data = load_metadata()

    if filename in data:

        del data[filename]

    save_metadata(data)


def get_upload_date(filename):

    data = load_metadata()

    return data.get(filename, {}).get("upload_date", "-")