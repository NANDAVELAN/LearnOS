from typing import List
from pydantic import BaseModel

class TopicPerformance(BaseModel):
    topic_name: str
    mastery_score: float
    recent_accuracy: float
    attempts_count: int
    difficulty: str = "medium"

def is_weak_topic(perf: TopicPerformance, mastery_threshold: float = 0.60, min_attempts: int = 1) -> bool:
    if perf.attempts_count < min_attempts:
        return False
    return perf.mastery_score < mastery_threshold or perf.recent_accuracy < 0.50

def rank_weak_topics(topics: List[TopicPerformance], mastery_threshold: float = 0.60) -> List[TopicPerformance]:
    weak = [t for t in topics if is_weak_topic(t, mastery_threshold=mastery_threshold)]
    return sorted(weak, key=lambda x: (x.mastery_score, x.recent_accuracy))
