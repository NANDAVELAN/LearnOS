from typing import List

def evaluate_intervention(recent_attention_scores: List[float], threshold: float = 0.40, min_samples: int = 5) -> bool:
    if len(recent_attention_scores) < min_samples:
        return False
    avg_score = sum(recent_attention_scores) / len(recent_attention_scores)
    return avg_score < threshold
