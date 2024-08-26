import json

default_apps = []
with open('server/application_data/extracted_swe_jobs.json', 'r') as file:
    all_applications = json.load(file)
    
    seen_links = set()  # To keep track of unique links
    for application in all_applications:
        if application['link'] not in seen_links:
            seen_links.add(application['link'])
            default_apps.append({
                'name': application['name'],
                'location': application['location'],
                'job_title': application['job_title'],
                'skills': application['skills'],
                'link': application['link'],
                'apply_link': application['apply_link'],
                'field': application['field']
            })

# Rewrite the JSON file without duplicates
with open('server/application_data/extracted_swe_jobs.json', 'w') as file:
    json.dump(default_apps, file, indent=4)

print("JSON file updated without duplicates.")
