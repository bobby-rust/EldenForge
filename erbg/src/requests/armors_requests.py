import requests
import json

r_armors_pg1 = requests.get("https://eldenring.fanapis.com/api/armors?limit=500")
r_armors_pg2 = requests.get("https://eldenring.fanapis.com/api/armors?limit=100&page=1")
r_armors_pg3 = requests.get("https://eldenring.fanapis.com/api/armors?limit=100&page=2")
r_armors_pg4 = requests.get("https://eldenring.fanapis.com/api/armors?limit=100&page=3")
r_armors_pg5 = requests.get("https://eldenring.fanapis.com/api/armors?limit=100&page=4")
r_armors_pg6 = requests.get("https://eldenring.fanapis.com/api/armors?limit=100&page=5")

armors_data_dict = json.loads(r_armors_pg1.text)
dataDict_pg2 = json.loads(r_armors_pg2.text)
dataDict_pg3 = json.loads(r_armors_pg3.text)
dataDict_pg4 = json.loads(r_armors_pg4.text)
dataDict_pg5 = json.loads(r_armors_pg5.text)
dataDict_pg6 = json.loads(r_armors_pg6.text)

for object in dataDict_pg2["data"]:
    armors_data_dict["data"].append(object)
for object in dataDict_pg3["data"]:
    armors_data_dict["data"].append(object)
for object in dataDict_pg4["data"]:
    armors_data_dict["data"].append(object)
for object in dataDict_pg5["data"]:
    armors_data_dict["data"].append(object)
for object in dataDict_pg6["data"]:
    armors_data_dict["data"].append(object)


name_list = []

for object in armors_data_dict['data']:
    print(object["name"])
    name_list.append(object["name"])

for name in name_list:
    print(name)

armors_data_dict["count"] = len(name_list)
print(len(name_list))

data = json.dumps(armors_data_dict)

with open("armors_data.json", "w") as f_data:
    f_data.write(data)