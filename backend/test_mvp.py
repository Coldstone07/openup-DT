import requests
import json
import time

BASE_URL = "http://localhost:8000"

def run_test():
    print("Starting AI Mentorship MVP Test...")

    # 1. Check Health
    try:
        resp = requests.get(f"{BASE_URL}/health")
        if resp.status_code == 200:
            print("[\u2713] API is healthy")
        else:
            print("[X] API unhealthy")
            return
    except Exception as e:
        print(f"[X] API not reachable. Make sure 'uvicorn main:app --reload' is running. Error: {e}")
        return

    # 2. Ingest Sample Sessions (Mentors)
    mentors = [
        {"user_id": "mentor_alice", "type": "mentor", "text": "I have 10 years experience in software architecture and leadership. I love helping people grow."},
        {"user_id": "mentor_bob", "type": "mentor", "text": "Expert in startup fundraising and risk management. Looking to advise early stage founders."},
        {"user_id": "mentor_charlie", "type": "mentor", "text": "Public speaking coach and executive presence trainer. I help with confidence and stage fright."},
        {"user_id": "mentor_diana", "type": "mentor", "text": "Product management veteran. Strategy, roadmapping, and user research are my forte."},
        {"user_id": "mentor_evan", "type": "mentor", "text": "Deep tech and AI researcher. mentorship in machine learning and data science careers."}
    ]

    print(f"\nIngesting {len(mentors)} Mentors...")
    for m in mentors:
        payload = {
            "user_id": m["user_id"],
            "user_type": m["type"],
            "transcript": m["text"]
        }
        res = requests.post(f"{BASE_URL}/session", json=payload)
        if res.status_code == 200:
            print(f"  \u2713 Ingested {m['user_id']}")
        else:
            print(f"  X Failed {m['user_id']}: {res.text}")

    # 3. Ingest Sample Sessions (Mentees)
    mentees = [
        {"user_id": "mentee_frank", "type": "mentee", "text": "I want to improve my leadership skills and become a manager."},
        {"user_id": "mentee_grace", "type": "mentee", "text": "Struggling with public speaking and anxiety in meetings."},
        {"user_id": "mentee_hank", "type": "mentee", "text": "Need help with my startup pitch deck and fundraising strategy."},
        {"user_id": "mentee_ivy", "type": "mentee", "text": "Transitioning into Product Management from engineering."},
        {"user_id": "mentee_jack", "type": "mentee", "text": "Want to learn more about AI and getting a job in data science."}
    ]

    print(f"\nIngesting {len(mentees)} Mentees...")
    for m in mentees:
        payload = {
            "user_id": m["user_id"],
            "user_type": m["type"],
            "transcript": m["text"]
        }
        res = requests.post(f"{BASE_URL}/session", json=payload)
        if res.status_code == 200:
            print(f"  \u2713 Ingested {m['user_id']}")
        else:
            print(f"  X Failed {m['user_id']}: {res.text}")

    # 4. Run Matching
    print("\nRunning Matching Simulation...")
    # Frank wants leadership -> Expect Alice
    res_frank = requests.post(f"{BASE_URL}/match", json={"user_id": "mentee_frank", "top_k": 3})
    print(f"Match for Frank (Leadership): {res_frank.json()}")

    # Grace wants public speaking -> Expect Charlie
    res_grace = requests.post(f"{BASE_URL}/match", json={"user_id": "mentee_grace", "top_k": 3})
    print(f"Match for Grace (Speaking): {res_grace.json()}")

    # Hank wants fundraising -> Expect Bob
    res_hank = requests.post(f"{BASE_URL}/match", json={"user_id": "mentee_hank", "top_k": 3})
    print(f"Match for Hank (Fundraising): {res_hank.json()}")

    # 5. Verify Graph Data
    print("\nVerifying Graph Data...")
    res_graph = requests.get(f"{BASE_URL}/graph")
    data = res_graph.json()
    user_count = len(data)
    print(f"Graph contains data for {user_count} users.")
    
    print("\nTest Complete.")

if __name__ == "__main__":
    run_test()
