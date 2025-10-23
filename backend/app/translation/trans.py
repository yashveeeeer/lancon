# import whisper
import numpy as np
import subprocess
import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.cloud import translate_v2 as translate
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from gtts import gTTS
import base64
import io
import tempfile
# from google.cloud import translate_v2 as translate

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()
# model = whisper.load_model("small")

translate_client = translate.Client()

# def Transcribe_audio(audio_bytes: bytes) -> JSONResponse:
#     try:
#         print(f"Received audio bytes length: {len(audio_bytes)}")
        
#         # Save to temporary WAV file for reliable Whisper processing
#         with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
#             temp_path = temp_file.name
#             process = subprocess.Popen(
#                 ['ffmpeg', '-y', '-i', 'pipe:0', '-f', 'wav', '-acodec', 'pcm_s16le', '-ac', '1', '-ar', '16000', temp_path],
#                 stdin=subprocess.PIPE,
#                 stdout=subprocess.PIPE,
#                 stderr=subprocess.PIPE
#             )
#             _, err = process.communicate(input=audio_bytes)
#             if process.returncode != 0:
#                 err_msg = err.decode()
#                 print(f"FFmpeg error: {err_msg}")
#                 raise ValueError(f"Audio conversion failed: {err_msg}")
        
#         # Transcribe the temporary file
#         result = model.transcribe(temp_path)
#         english_text = result['text'].strip()
#         print(f"Whisper transcribed text: '{english_text}'")
        
#         # Clean up temp file
#         os.unlink(temp_path)
        
#         if not english_text:
#             return JSONResponse(content={
#                 "english_text": "[No speech detected]",
#                 "japanese_text": "[音声が検出されませんでした]",
#                 "japanese_audio": ""
#             })
        
#         translated_jap = translator(english_text,"ja")
#         print(f"Translated Japanese text: '{translated_jap}'")
        
#         jap_audio = ""
#         if translated_jap and translated_jap.strip():
#             jap_audio = jap_speech(translated_jap)
        
#         return JSONResponse(content={
#             "english_text": english_text,
#             "japanese_text": translated_jap,
#             "japanese_audio": jap_audio
#         })
        
#     except Exception as e:
#         print(f"Error in Transcribe_audio: {str(e)}")
#         return JSONResponse(content={
#             "english_text": f"[Error: {str(e)}]",
#             "japanese_text": "[エラーが発生しました]",
#             "japanese_audio": ""
#         }, status_code=500)

def translator(text,changer):

      try:
          result = translate_client.translate(text,target_language=changer)
          
          return result["translatedText"]
      except Exception as e:
          print(f"Error in translation: {str(e)}")
          return e

def detector(text):
     try:
        result = translate_client.detect_language(text)
        return result
     except Exception as e:
        print(f"Error in language detection:{str(e)}")
        return e


def jap_speech(translated_jap):
    try:
        if not translated_jap or not translated_jap.strip():
            print("Warning: No text provided for speech synthesis")
            return ""
            
        clean_text = translated_jap.strip()
        if clean_text.startswith('[') and clean_text.endswith(']'):
            print("Warning: Skipping speech synthesis for error message")
            return ""
            
        print(f"Generating speech for: '{clean_text}'")
        
        audio_buffer = io.BytesIO()
        tts = gTTS(clean_text, lang='ja')
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        japanese_audio_base64 = base64.b64encode(audio_buffer.read()).decode("utf-8")
        
        print("Speech synthesis completed successfully")
        return japanese_audio_base64
        
    except Exception as e:
        print(f"Error in jap_speech: {str(e)}")
        return ""
