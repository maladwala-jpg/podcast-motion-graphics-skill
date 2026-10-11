"""Audio helpers shared by build_audio.py and verify.py (needs numpy, scipy, pyloudnorm — installed by setup.sh)."""
import subprocess, numpy as np
from toolenv import ffmpeg_path

SR = 44100

def load_audio(path, sr=SR):
    """Decode any audio/video file to float32 stereo at `sr` Hz -> array (n, 2)."""
    raw = subprocess.run([ffmpeg_path(), '-hide_banner', '-loglevel', 'error', '-i', path, '-vn', '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

def frame_db(a, sr=SR, hop_s=0.02):
    hop = int(sr * hop_s); mono = a.mean(1); n = len(mono) // hop
    rms = np.sqrt((mono[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(rms), hop_s

def utterances(a, sr=SR, gate_db=-45.0, min_gap=0.35, min_len=0.5):
    """Speech turns as [(start_s, end_s), ...]: energy-gated, gaps shorter than `min_gap` merged, turns shorter than `min_len` dropped.
    AI-avatar voices sit on near-digital silence, so a simple gate is reliable."""
    db, hop = frame_db(a, sr); sp = db > gate_db; segs = []; st = None
    for i, v in enumerate(sp):
        if v and st is None: st = i
        if not v and st is not None: segs.append([st, i]); st = None
    if st is not None: segs.append([st, len(sp)])
    mg = []
    for s, e in segs:
        if mg and (s - mg[-1][1]) * hop < min_gap: mg[-1][1] = e
        else: mg.append([s, e])
    return [(s * hop, e * hop) for s, e in mg if (e - s) * hop >= min_len]

def loudness(a, sr=SR):
    """Integrated loudness (LUFS, ITU-R BS.1770) of a stereo float array; -inf if too short/quiet."""
    import pyloudnorm as pyln
    try:
        v = pyln.Meter(sr).integrated_loudness(a)
        return float(v) if np.isfinite(v) else float('-inf')
    except Exception:
        return float('-inf')

def utterance_lufs(a, utts, sr=SR):
    return [loudness(a[int(s * sr):int(e * sr)], sr) for s, e in utts]

def true_peak_db(a, sr=SR):
    from scipy.signal import resample_poly
    peak = 0.0
    for ch in range(a.shape[1]):
        peak = max(peak, float(np.abs(resample_poly(a[:, ch], 4, 1)).max()))
    return 20 * np.log10(peak + 1e-12)

def spread_stats(lufs):
    v = np.array([x for x in lufs if np.isfinite(x)])
    return {'n': int(len(v)), 'min': float(v.min()), 'max': float(v.max()), 'median': float(np.median(v)), 'std': float(v.std())} if len(v) else {}
