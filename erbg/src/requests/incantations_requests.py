import requests
import json

r_incantations_pg1 = requests.get("https://eldenring.fanapis.com/api/incantations?limit=100")

incantations_data_dict = json.loads(r_incantations_pg1.text)

name_list = []

for object in incantations_data_dict['data']:
    print(object["name"])
    name_list.append(object["name"])

for name in name_list:
    print(name)

incantations_data_dict["count"] = len(name_list)
print(len(name_list))

data = json.dumps(incantations_data_dict)

with open("incantations_data.json", "w") as f_data:
    print("creating file")
    f_data.write(data)