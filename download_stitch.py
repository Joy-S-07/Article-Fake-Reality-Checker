import urllib.request
import json
import os
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

API_KEY = "AQ.Ab8RN6JJwEcBPA6u6bun5rrfuV8YWrkMdA0Aaz20ZQDYaCpAsw"
PROJECT_ID = "9941832727281057949"

SCREENS = {
    "Landing Page": "cb77e2bfaa824e969b10284697335ce0",
    "Verification Page": "ced54b7f070649abbb2ba0baeb44d0c7",
    "Verification Results": "85126f7162184db5b89f61fa4ed1bee4",
    "User Dashboard": "efc00c57db4a4d06bdbc1086ae610590",
    "About TruthLens": "b20cc47769c941d58bed2d5817078851",
    "Sign In": "2fd61d6f176a475a8e457fc5f36b3ae8"
}

os.makedirs("stitch_exports", exist_ok=True)

headers = {"X-Goog-Api-Key": API_KEY}

def download_file(url, path):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"  Downloaded: {path}")
    except Exception as e:
        print(f"  Failed to download {url}: {e}")

design_system_saved = False

for name, screen_id in SCREENS.items():
    print(f"Processing screen: {name} ({screen_id})")
    url = f"https://stitch.googleapis.com/v1/projects/{PROJECT_ID}/screens/{screen_id}"
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            if not design_system_saved and "designSystem" in data:
                with open("stitch_exports/design_system.json", "w", encoding='utf-8') as f:
                    json.dump(data["designSystem"], f, indent=2)
                print("  Saved design system.")
                design_system_saved = True
            
            safe_name = name.replace(" ", "_").lower()
            screen_dir = f"stitch_exports/{safe_name}"
            os.makedirs(screen_dir, exist_ok=True)
            
            if "htmlCode" in data and "downloadUrl" in data["htmlCode"]:
                download_file(data["htmlCode"]["downloadUrl"], f"{screen_dir}/index.html")
            
            if "screenshot" in data and "downloadUrl" in data["screenshot"]:
                download_file(data["screenshot"]["downloadUrl"], f"{screen_dir}/preview.png")
                
    except Exception as e:
        print(f"Failed to process {name}: {e}")

print("Done downloading all screens.")
