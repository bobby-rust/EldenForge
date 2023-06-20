import requests
import json
from typing import Final

MAX_PAGES: Final[int] = 99 # arbitrary number chosen because there should never be more than 100 pages of items of this category

r_ashes = []

for i in range(MAX_PAGES):
    try:
        response = requests.get(f"https://eldenring.fanapis.com/api/ashes?limit=500&page={i}")
        if (json.loads(response.text)["count"] > 0):
            r_ashes.append(response)
        else:
            break
    except requests.exceptions.InvalidURL:
        print("Invalid URL")
        break
    except Exception as e:
        print("An unhandled exception occurred: ", end="")
        print(str(e))
        exit()

ashes_data_dict = json.loads(r_ashes[0].text)

for response in r_ashes[1:]:
    res_dict = json.loads(response.text) # convert json response to python dict
    for element in res_dict["data"]:
        ashes_data_dict["data"].append(element)

ashes_data_dict["count"] = len(ashes_data_dict["data"])
print(f"Found {ashes_data_dict['count']} ashes.")

# convert python dict to json and save as file
data = json.dumps(ashes_data_dict)
with open("ashes_data.json", "w") as f_data:
    f_data.write(data)