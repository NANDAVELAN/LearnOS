import pytest
from learning.mastery import calculate_topic_mastery, aggregate_course_mastery
from learning.weak_topics import is_weak_topic, rank_weak_topics, TopicPerformance
from learning.scheduler import calculate_spaced_interval, should_recommend_break
from learning.adaptation import adjust_topic_allocation

def test_calculate_topic_mastery():
    m1 = calculate_topic_mastery(0.0, 1.0, alpha=0.6)
    assert m1 == 0.4
    m2 = calculate_topic_mastery(1.0, 1.0)
    assert m2 == 1.0
    assert calculate_topic_mastery(-0.5, 0.5) >= 0.0
    assert calculate_topic_mastery(1.5, 1.2) <= 1.0

def test_aggregate_course_mastery():
    assert aggregate_course_mastery([]) == 0.0
    assert aggregate_course_mastery([0.8, 0.6, 1.0]) == 0.8

def test_weak_topic_detection():
    topic_strong = TopicPerformance(topic_name="Vectors", mastery_score=0.85, recent_accuracy=0.90, attempts_count=3)
    assert is_weak_topic(topic_strong) is False
    topic_weak = TopicPerformance(topic_name="Eigenvalues", mastery_score=0.45, recent_accuracy=0.40, attempts_count=2)
    assert is_weak_topic(topic_weak) is True
    unattempted = TopicPerformance(topic_name="PCA", mastery_score=0.2, recent_accuracy=0.2, attempts_count=0)
    assert is_weak_topic(unattempted, min_attempts=1) is False

def test_rank_weak_topics():
    topics = [
        TopicPerformance(topic_name="A", mastery_score=0.9, recent_accuracy=0.9, attempts_count=1),
        TopicPerformance(topic_name="B", mastery_score=0.3, recent_accuracy=0.3, attempts_count=2),
        TopicPerformance(topic_name="C", mastery_score=0.5, recent_accuracy=0.4, attempts_count=2),
    ]
    ranked = rank_weak_topics(topics)
    assert len(ranked) == 2
    assert ranked[0].topic_name == "B"
    assert ranked[1].topic_name == "C"

def test_spaced_interval():
    interval, count = calculate_spaced_interval(10, 4, rating=1)
    assert interval == 1
    assert count == 1
    int1, c1 = calculate_spaced_interval(1, 0, rating=2)
    assert int1 == 1
    int2, c2 = calculate_spaced_interval(int1, c1, rating=2)
    assert int2 == 3
    int3, c3 = calculate_spaced_interval(int2, c2, rating=2)
    assert int3 == 7

def test_break_recommendations():
    assert should_recommend_break(70.0, 0.2, minutes_since_last_break=10.0, cooldown_minutes=25.0) is False
    assert should_recommend_break(65.0, 0.9, minutes_since_last_break=30.0) is True
    assert should_recommend_break(25.0, 0.25, minutes_since_last_break=30.0) is True
    assert should_recommend_break(15.0, 0.85, minutes_since_last_break=30.0) is False

def test_adjust_topic_allocation():
    assert adjust_topic_allocation(2.0, 0.4, is_weak=True) == 3.0
    assert adjust_topic_allocation(2.0, 0.9, is_weak=False) == 1.4
    assert adjust_topic_allocation(2.0, 0.7, is_weak=False) == 2.0
