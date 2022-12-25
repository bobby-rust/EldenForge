import requests
import json

r_weapons_pg1 = requests.get("https://eldenring.fanapis.com/api/weapons?limit=100")
r_weapons_pg2 = requests.get("https://eldenring.fanapis.com/api/weapons?limit=100&page=1")
r_weapons_pg3 = requests.get("https://eldenring.fanapis.com/api/weapons?limit=100&page=2")
r_weapons_pg4 = requests.get("https://eldenring.fanapis.com/api/weapons?limit=100&page=3")

weapons_data_dict = json.loads(r_weapons_pg1.text)
dataDict_pg2 = json.loads(r_weapons_pg2.text)
dataDict_pg3 = json.loads(r_weapons_pg3.text)
dataDict_pg4 = json.loads(r_weapons_pg4.text)

for object in dataDict_pg2["data"]:
    weapons_data_dict["data"].append(object)
for object in dataDict_pg3["data"]:
    weapons_data_dict["data"].append(object)
for object in dataDict_pg4["data"]:
    weapons_data_dict["data"].append(object)

name_list = []

for object in weapons_data_dict['data']:
    print(object["name"])
    name_list.append(object["name"])

for name in name_list:
    print(name)

weapons_data_dict["count"] = len(name_list)
print(len(name_list))

data = json.dumps(weapons_data_dict)

with open("weapons_data.json", "w") as f_data:
    f_data.write(data)