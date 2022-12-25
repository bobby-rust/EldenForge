import requests
import json

r_spirits_pg1 = requests.get("https://eldenring.fanapis.com/api/spirits?limit=100")

spirits_data_dict = json.loads(r_spirits_pg1.text)

name_list = []

for object in spirits_data_dict['data']:
    print(object["name"])
    name_list.append(object["name"])

for name in name_list:
    print(name)

spirits_data_dict["count"] = len(name_list)
print(len(name_list))

data = json.dumps(spirits_data_dict)

with open("spirits_data.json", "w") as f_data:
    print("creating file")
    f_data.write(data)