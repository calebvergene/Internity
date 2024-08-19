import json

with open('server/application_data/extracted_swe_jobs.json', 'r') as file:
        all_applications = json.load(file)
        for app in all_applications:
                if '\n' in app['location']:
                        app['location'] = 'Multi Location'
        
with open('server/application_data/extracted_swe_jobs.json', 'w') as file:
        json.dump(all_applications, file, indent=4)