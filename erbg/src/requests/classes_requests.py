import requests
import json

r_classes_pg1 = requests.get("https://eldenring.fanapis.com/api/classes?limit=100")

classes_data_dict = json.loads(r_classes_pg1.text)

name_list = []

for object in classes_data_dict['data']:
    print(object["name"])
    name_list.append(object["name"])

for name in name_list:
    print(name)

classes_data_dict["count"] = len(name_list)
print(len(name_list))

data = json.dumps(classes_data_dict)

with open("classes_data.json", "w") as f_data:
    print("creating file")
    f_data.write(data)