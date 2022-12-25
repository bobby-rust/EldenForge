import requests
import json

r_shields_pg1 = requests.get("https://eldenring.fanapis.com/api/shields?limit=100")

shields_data_dict = json.loads(r_shields_pg1.text)

name_list = []

for object in shields_data_dict['data']:
    print(object["name"])
    name_list.append(object["name"])

for name in name_list:
    print(name)

shields_data_dict["count"] = len(name_list)
print(len(name_list))

data = json.dumps(shields_data_dict)

with open("shields_data.json", "w") as f_data:
    print("creating file")
    f_data.write(data)