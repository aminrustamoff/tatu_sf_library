from django.conf import settings
from google import genai


def run_ai_prompt(prompt, user=None):
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY topilmadi. .env faylni tekshiring.")

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    system_text = (
        "Sen foydalanuvchiga sodda, aniq va foydali javob beradigan yordamchisan. "
        "Javobni foydalanuvchi tilida qaytar."
    )

    full_prompt = f"""
{system_text}

Foydalanuvchi savoli:
{prompt}
"""

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=full_prompt
    )

    return response.text or "AI javob qaytarmadi."