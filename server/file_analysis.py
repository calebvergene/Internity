import PyPDF2
import fitz
import pandas as pd
import spacy
from default_apps import skill_set
import json
from setup_app_database import get_all_applications

def extract_text_from_pdf(file):
    """
    Extracts the text from a resume
    """
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in range(len(pdf_reader.pages)):
        text += pdf_reader.pages[page].extract_text()
    return text


def extract_skills(file, text, skill_set):
    """
    Analyzes text in a resume and compares words to a list of skills. If any skills are found in the resume, 
    they are pulled out and returned
    """
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    extracted_skills = set()

    # Look for any word or phrase in the skill set
    for token in doc:
        if token.text.lower() in skill_set:
            extracted_skills.add(token.text)
        

    # needs more testing, adds bolded words to the skills list
    doc = fitz.open(stream=file.read(), filetype="pdf")
    for page in doc:
        blocks = page.get_text("dict")["blocks"]
        for block in blocks:
            for line in block["lines"]:
                for span in line["spans"]:
                    if "Bold" in span["font"]:
                        print(span["text"].split())
                        extract_skills.add(span["text"].split())

    return extracted_skills


def analyze_resume(file):
    """
    Compares skills in resume to each job, creating a similarity score for each
    """
    nlp = spacy.load("en_core_web_md")
    text = extract_text_from_pdf(file)
    resume_skills = extract_skills(file, text, skill_set())
    print("Skills found:", resume_skills)


    resume_doc = nlp(" ".join(resume_skills))
    get_all_applications()
    all_applications = get_all_applications()
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
