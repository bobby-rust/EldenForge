import requests
import json

r_ashes_pg1 = requests.get("https://eldenring.fanapis.com/api/ashes?limit=100")

ashes_data_dict = json.loads(r_ashes_pg1.text)

name_list = []

for object in ashes_data_dict['data']:
    print(object["name"])
    name_list.append(object["name"])

for name in name_list:
    print(name)

ashes_data_dict["count"] = len(name_list)
print(len(name_list))

data = json.dumps(ashes_data_dict)

with open("ashes_data.json", "w") as f_data:
    print("creating file")
    f_data.write(data)