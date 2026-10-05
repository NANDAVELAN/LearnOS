from typing import List

def calculate_topic_mastery(current_mastery: float, quiz_score: float, alpha: float = 0.6) -> float:
    clamped_current = max(0.0, min(1.0, current_mastery))
    clamped_score = max(0.0, min(1.0, quiz_score))
    updated = (alpha * clamped_current) + ((1.0 - alpha) * clamped_score)
    return round(max(0.0, min(1.0, updated)), 4)

def aggregate_course_mastery(topic_masteries: List[float]) -> float:
    if not topic_masteries:
        return 0.0
    valid_scores = [max(0.0, min(1.0, m)) for m in topic_masteries]
    return round(sum(valid_scores) / len(valid_scores), 4)
