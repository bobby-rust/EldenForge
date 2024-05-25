import requests
import json
from typing import Final

MAX_PAGES: Final[int] = 99 # arbitrary number chosen because there should never be more than 100 pages of items of this category

r_classes = []

for i in range(MAX_PAGES):
    try:
        response = requests.get(f"https://eldenring.fanapis.com/api/classes?limit=500&page={i}")
        if (json.loads(response.text)["count"] > 0):
            r_classes.append(response)
        else:
            break
    except requests.exceptions.InvalidURL:
        print("Invalid URL")
        break
    except Exception as e:
        print("An unhandled exception occurred: ", end="")
        print(str(e))
        exit()

classes_data_dict = json.loads(r_classes[0].text)

for response in r_classes[1:]:
    res_dict = json.loads(response.text) # convert json response to python dict
    for element in res_dict["data"]:
        classes_data_dict["data"].append(element)

classes_data_dict["count"] = len(classes_data_dict["data"])
print(f"Found {classes_data_dict['count']} classes.")

# convert python dict to json and save as file
data = json.dumps(classes_data_dict)
with open("classes_data.json", "w") as f_data:
    f_data.write(data)