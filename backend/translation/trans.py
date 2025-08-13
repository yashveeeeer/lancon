import whisper
import numpy as np
import subprocess
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.responses import JSONResponse
from gtts import gTTS
import base64
import io


load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


model = whisper.load_model("small")


def Transcribe_audio(audio_bytes:bytes) -> str:
    # function to convert english-audio to english-text and then english-text to japanese-text then japanese-text to japanese-audio
    audio_data,_=Bytes_to_numpy(audio_bytes)
    result = model.transcribe(audio_data)
    translated_jap=eng_to_jap(result)
    jap_audio = jap_speech(translated_jap)
    return JSONResponse(content={
    "english_text": result['text'],
    "japanese_text": translated_jap,
    "japanese_audio": jap_audio
})


def Bytes_to_numpy(audio_bytes):
    # Run ffmpeg in a subprocess to decode to PCM 16-bit signed little-endian at 16kHz mono
    process = subprocess.Popen(
        ['ffmpeg', '-i', 'pipe:0', '-f', 'f32le', '-acodec', 'pcm_f32le', '-ac', '1', '-ar', '16000', 'pipe:1'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL
    )
    pcm_data, err = process.communicate(input=audio_bytes)
    # Convert raw PCM bytes to NumPy array
    audio_np = np.frombuffer(pcm_data, np.float32)
    return audio_np, 16000


def eng_to_jap(result):

    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt =f""" Translate the following text to Japanese.
    Return only the translation. No explanation. No romanization.
    Text: "{result}"""
    
    response = model.generate_content(prompt)
    print(response.text)
    return response.text.strip()


def jap_speech(translated_jap):
    audio_buffer = io.BytesIO()
    tts = gTTS(translated_jap,lang = 'ja')
    tts.write_to_fp(audio_buffer)
    audio_buffer.seek(0)
    japanese_audio_base64 = base64.b64encode(audio_buffer.read()).decode("utf-8")
    return japanese_audio_base64
