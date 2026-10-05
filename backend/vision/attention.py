def calculate_attention_score(eye_attention: float, gaze_attention: float, face_presence: float, head_orientation: float) -> float:
    score = (
        0.40 * max(0.0, min(1.0, eye_attention))
        + 0.30 * max(0.0, min(1.0, gaze_attention))
        + 0.20 * max(0.0, min(1.0, face_presence))
        + 0.10 * max(0.0, min(1.0, head_orientation))
    )
    return round(score, 4)

def classify_attention_state(score: float) -> str:
    if score >= 0.75:
        return "FOCUSED"
    elif score >= 0.50:
        return "SLIGHTLY_DISTRACTED"
    elif score >= 0.25:
        return "ATTENTION_DROPPING"
    else:
        return "BREAK_RECOMMENDED"
