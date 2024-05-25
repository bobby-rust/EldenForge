import requests
import json
from typing import Final

MAX_PAGES: Final[int] = 99 # arbitrary number chosen because there should never be more than 100 pages of items of this category

r_talismans = []

for i in range(MAX_PAGES):
    try:
        response = requests.get(f"https://eldenring.fanapis.com/api/talismans?limit=500&page={i}")
        if (json.loads(response.text)["count"] > 0):
            r_talismans.append(response)
        else:
            break
    except requests.exceptions.InvalidURL:
        print("Invalid URL")
        break
    except Exception as e:
        print("An unhandled exception occurred: ", end="")
        print(str(e))
        exit()

talismans_data_dict = json.loads(r_talismans[0].text)

for response in r_talismans[1:]:
    res_dict = json.loads(response.text) # convert json response to python dict
    for element in res_dict["data"]:
        talismans_data_dict["data"].append(element)

talismans_data_dict["count"] = len(talismans_data_dict["data"])
print(f"Found {talismans_data_dict['count']} talismans.")

# convert python dict to json and save as file
data = json.dumps(talismans_data_dict)
with open("talismans_data.json", "w") as f_data:
    f_data.write(data)