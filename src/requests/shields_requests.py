import requests
import json

r_shields = []

for i in range(99): # arbitrary number chosen because there should never be more than 99 pages of items of this category
    try:
        response = requests.get(f"https://eldenring.fanapis.com/api/shields?limit=500&page={i}")
        if (json.loads(response.text)["count"] > 0):
            r_shields.append(response)
        else:
            break
    except requests.exceptions.InvalidURL:
        print("Invalid URL")
        break
    except Exception as e:
        print("An unhandled exception occurred: ", end="")
        print(str(e))
        exit()

shields_data_dict = json.loads(r_shields[0].text)

for response in r_shields[1:]:
    res_dict = json.loads(response.text) # convert json response to python dict
    for element in res_dict["data"]:
        shields_data_dict["data"].append(element)

shields_data_dict["count"] = len(shields_data_dict["data"])
print(f"Found {shields_data_dict['count']} shields.")

# convert python dict to json and save as file
data = json.dumps(shields_data_dict)
with open("shields_data.json", "w") as f_data:
    f_data.write(data)