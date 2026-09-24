from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SKILLS = [
    "python", "java", "c", "c++", "javascript", "typescript",
    "react", "next.js", "node.js", "html", "css",
    "sql", "mysql", "mongodb",
    "machine learning", "deep learning", "artificial intelligence",
    "data science", "pandas", "numpy", "scikit-learn",
    "tensorflow", "pytorch",
    "git", "github", "docker", "aws",
    "figma", "agile", "scrum",
    "communication", "leadership"
]


def extract_text_from_pdf(file_bytes):
    with open("temp_resume.pdf", "wb") as f:
        f.write(file_bytes)

    reader = PdfReader("temp_resume.pdf")

    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    return text


def find_skills(text):
    text = text.lower()
    found = []

    for skill in SKILLS:
        if skill.lower() in text:
            found.append(skill)

    return found


@app.get("/")
def home():
    return {"message": "ResumeAI ML backend is running"}


@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    resume_bytes = await resume.read()

    resume_text = extract_text_from_pdf(resume_bytes)
    print("---RESUME TEXT---")
    print(resume_text)
    print("------")

    resume_skills = find_skills(resume_text)
    job_skills = find_skills(job_description)

    matching = sorted(set(resume_skills) & set(job_skills))
    missing = sorted(set(job_skills) - set(resume_skills))

    if job_description.strip() and resume_text.strip():
        vectorizer = TfidfVectorizer(stop_words="english")

        vectors = vectorizer.fit_transform(
            [resume_text, job_description]
        )

        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

        text_score=similarity*100

        if job_skills:
            skill_score=(len(matching)/len(job_skills))*100

            match=round((text_score*0.5)+(skill_score*0.5))
        else:
            match = round(similarity * 100)

    else:
        match = 0

    strengths = [
        f"Resume contains {len(resume_skills)} relevant skills.",
        f"{len(matching)} skills match the target job.",
        "Resume text was successfully extracted from the uploaded PDF."
    ]

    recommendations = []

    for skill in missing[:5]:
        recommendations.append(
            f"Consider learning or strengthening {skill}."
        )

    if not recommendations:
        recommendations.append(
            "Your resume covers the detected skills in the job description."
        )

    return {
        "match": match,
        "matching": matching,
        "missing": missing,
        "strengths": strengths,
        "recommendations": recommendations
    }