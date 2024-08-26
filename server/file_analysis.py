import PyPDF2
import fitz
import spacy
from .default_apps import skill_set
import json

def extract_text_from_pdf(file):
    """
    Extracts the text from a resume
    """
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in range(len(pdf_reader.pages)):
        text += pdf_reader.pages[page].extract_text()
    return text


def extract_skills(file, skill_set):
    """
    Analyzes text in a resume and compares words to a list of skills. If any skills are found in the resume, 
    they are pulled out and returned
    """
    nlp = spacy.load("en_core_web_sm")
    text = extract_text_from_pdf(file)
    doc = nlp(text)
    extracted_skills = set()

    # Look for any word or phrase in the skill set
    for token in doc:
        if token.text.lower() in skill_set:
            extracted_skills.add(token.text)
        

    # Needs more testing, adds bolded words to the skills list
    doc = fitz.open(stream=file.read(), filetype="pdf")
    for page in doc:
        blocks = page.get_text("dict")["blocks"]
        for block in blocks:
            for line in block["lines"]:
                for span in line["spans"]:
                    if "Bold" in span["font"]:
                        #print(span["text"].split())
                        extract_skills.add(span["text"].split())

    return extracted_skills


def analyze_resume(file):
    """
    Compares skills in resume to each job, creating a similarity score for each
    """
    nlp = spacy.load("en_core_web_md")
    resume_skills = extract_skills(file, skill_set())

    resume_doc = nlp(" ".join(resume_skills))

    with open('server/application_data/extracted_swe_jobs.json', 'r') as json_file:
        applications = json.load(json_file)
        all_applications = []
        for application in applications:
            all_applications.append({
                'name': application['name'],
                'location': application['location'],
                'role': application['job_title'],
                'skills': application['skills'],
                'link': application['link'],
                'apply_link': application['apply_link'],
                'field': application['field']
            })
    similarity_results = []
    for application in all_applications:
        job_role_doc = nlp(" ".join(application['skills']))     
        similarity = resume_doc.similarity(job_role_doc)
        if similarity == 0.0:
            similarity = 0.04
        similarity = round(similarity, 2)
        similarity = f"{similarity:.2f}"
        similarity_results.append({"name":application["name"], "role": application['role'], "location": application['location'], "similarity": similarity})
        # ranked_similarity_roles = sorted(similarity_results, key=lambda x: x["similarity"], reverse=True)
    return similarity_results
