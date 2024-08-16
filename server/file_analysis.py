import PyPDF2
import spacy
from default_apps import skill_set

def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in range(len(pdf_reader.pages)):
        text += pdf_reader.pages[page].extract_text()
    return text


def extract_skills(text, skill_set):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    extracted_skills = set()

    # Look for any word or phrase in the skill set
    for token in doc:
        if token.text.lower() in skill_set:
            extracted_skills.add(token.text.lower())

    return extracted_skills



def analyze_resume(file):
    text= extract_text_from_pdf(file)
    skills_found = extract_skills(text, skill_set())
    print("Skills found:", skills_found)
    