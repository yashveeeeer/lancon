import whisper
import numpy as np
import subprocess

model = whisper.load_model("small")


def Transcribe_audio(audio_bytes:bytes) -> str:
    
    audio_data,_=Bytes_to_numpy(audio_bytes)
    result = model.transcribe(audio_data)
    print(result["text"])
    return result["text"]


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