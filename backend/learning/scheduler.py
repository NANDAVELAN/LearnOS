from typing import Tuple

def calculate_spaced_interval(current_interval: int, repetition_count: int, rating: int) -> Tuple[int, int]:
    if rating <= 1:
        return (1, 1)
    if repetition_count == 0:
        next_interval = 1
    elif repetition_count == 1:
        next_interval = 3
    elif repetition_count == 2:
        next_interval = 7
    else:
        multiplier = 2.0 if rating == 2 else 2.5
        next_interval = int(round(current_interval * multiplier))
    return (max(1, next_interval), repetition_count + 1)

def should_recommend_break(continuous_study_minutes: float, recent_attention_average: float, minutes_since_last_break: float, cooldown_minutes: float = 25.0) -> bool:
    if minutes_since_last_break < cooldown_minutes:
        return False
    if continuous_study_minutes >= 60.0:
        return True
    if continuous_study_minutes >= 20.0 and recent_attention_average < 0.35:
        return True
    return False
