import requests
import json

r_sorceries_pg1 = requests.get("https://eldenring.fanapis.com/api/sorceries?limit=100")

sorceries_data_dict = json.loads(r_sorceries_pg1.text)

name_list = []

for object in sorceries_data_dict['data']:
    print(object["name"])
    name_list.append(object["name"])

for name in name_list:
    print(name)

sorceries_data_dict["count"] = len(name_list)
print(len(name_list))

data = json.dumps(sorceries_data_dict)

with open("sorceries_data.json", "w") as f_data:
    print("creating file")
    f_data.write(data)