import json

with open('server/application_data/extracted_swe_jobs.json', 'r') as json_file:
        applications = json.load(json_file)
        print('x')