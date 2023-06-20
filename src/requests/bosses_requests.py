import requests
import json

r_bosses = []

for i in range(99): # arbitrary number chosen because there should never be more than 99 pages of items of this category
    try:
        response = requests.get(f"https://eldenring.fanapis.com/api/bosses?limit=500&page={i}")
        if (json.loads(response.text)["count"] > 0):
            r_bosses.append(response)
        else:
            break
    except requests.exceptions.InvalidURL:
        print("Invalid URL")
        break
    except Exception as e:
        print("An unhandled exception occurred: ", end="")
        print(str(e))
        exit()

bosses_data_dict = json.loads(r_bosses[0].text)

for response in r_bosses[1:]:
    res_dict = json.loads(response.text) # convert json response to python dict
    for element in res_dict["data"]:
        bosses_data_dict["data"].append(element)

bosses_data_dict["count"] = len(bosses_data_dict["data"])
print(f"Found {bosses_data_dict['count']} bosses.")

# convert python dict to json and save as file
data = json.dumps(bosses_data_dict)
with open("bosses_data.json", "w") as f_data:
    f_data.write(data)