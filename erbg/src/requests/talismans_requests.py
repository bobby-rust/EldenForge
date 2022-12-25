import requests
import json

r_talismans_pg1 = requests.get("https://eldenring.fanapis.com/api/talismans?limit=100")

talismans_data_dict = json.loads(r_talismans_pg1.text)

name_list = []

for object in talismans_data_dict['data']:
    print(object["name"])
    name_list.append(object["name"])

for name in name_list:
    print(name)

talismans_data_dict["count"] = len(name_list)
print(len(name_list))

data = json.dumps(talismans_data_dict)

with open("talismans_data.json", "w") as f_data:
    print("creating file")
    f_data.write(data)