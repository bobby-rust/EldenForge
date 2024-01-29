import json
import uuid

with open("./crystal_tears.json") as f:
    contents = f.read()
    json_as_dict = json.loads(contents)
    new_dict = {}
    for key, val in json_as_dict.items():
        new_dict[key] = val

    new_dict["data"] = []
    images = ["https://eldenring.wiki.fextralife.com/file/Elden-Ring/crimson_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/crimsonspill_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/crimsonburst_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/cerulean_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/greenspill_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/greenburst_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/strength-knot_crystal_tear_elden_ring_wiki_guide_200px.png", 
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/dexterity-knot_crystal_tear2_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/intelligence-knot_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/faith-knot_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/opaline_hardtear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/speckled_hardtear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/leaden_hardtear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/magic-shrouding_cracked_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/flame-shrouding_cracked_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/lightning-shrouding_cracked_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/holy-shrouding_cracked_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/stonebarb_cracked_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/spiked_cracked_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/thorny_cracked_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/twiggy_cracked_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/winged_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/windy_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/crimson_bubbletear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/crimsonwhorl-bubblecar-key-item-description.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/opaline_bubbletear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/cerulean_hidden_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/purifying_crystal_tear_elden_ring_wiki_guide_200px.png",
              "https://eldenring.wiki.fextralife.com/file/Elden-Ring/ruptured_crystal_tear_elden_ring_wiki_guide_200px.png"]

    for i, o in enumerate(json_as_dict["data"]):
        items = list(o.items())
        
        id = uuid.uuid4()
        items.insert(0, ("id", str(id)))

        o = dict(items)
        o["image"] = images[i]
        new_dict["data"].append(o)
   
    with open("./new_crystal_tears.json", "w") as new_f:
        json.dump(new_dict, new_f)

