def adjust_topic_allocation(base_hours: float, mastery_score: float, is_weak: bool) -> float:
    if is_weak or mastery_score < 0.50:
        return round(base_hours * 1.5, 1)
    elif mastery_score >= 0.85:
        return round(max(0.5, base_hours * 0.7), 1)
    return round(base_hours, 1)
