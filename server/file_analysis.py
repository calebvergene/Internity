import PyPDF2
import fitz
import pandas as pd
import spacy
from default_apps import skill_set

def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in range(len(pdf_reader.pages)):
        text += pdf_reader.pages[page].extract_text()
    return text


def extract_skills(file, text, skill_set):
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
    text = extract_text_from_pdf(file)
    skills_found = extract_skills(file, text, skill_set())
    
    print("Skills found:", skills_found)
    
    