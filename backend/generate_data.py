import requests
import random
import time

BASE_URL = "http://localhost:8000"

topics = [
    "leadership", "public speaking", "fundraising", "marketing", "product management",
    "software engineering", "data science", "AI/ML", "career transition", "negotiation",
    "team building", "burnout", "time management", "conflict resolution", "strategy"
]

adjectives = [
    "passionate", "experienced", "struggling", "anxious", "excited", "looking for",
    "expert in", "veteran", "newbie", "aspiring", "seasoned"
]

# Templates for Mentors
mentor_templates = [
    "I am a {adj} {topic} leader with over 10 years of experience. I love helping others grow.",
    "Expert in {topic} and {topic}. I have led teams at multiple startups.",
    "I can help you with {topic}. My style is direct and actionable.",
    "Senior VP of {topic} here. I have time to mentor 2-3 people.",
    "I specialize in {topic} for underrepresented founders."
]

# Templates for Mentees
mentee_templates = [
    "I am {adj} about {topic} and need guidance on next steps.",
    "Looking for help with {topic}. I feel overwhelmed.",
    "I want to transition into {topic} but don't know where to start.",
    "Struggling with {topic} at my current job. Need a fresh perspective.",
    "I have a big presentation on {topic} coming up and need coaching."
]

def generate_user(user_type, idx):
    topic1 = random.choice(topics)
    topic2 = random.choice(topics)
    adj = random.choice(adjectives)
    
    if user_type == "mentor":
        template = random.choice(mentor_templates)
        user_id = f"mentor_{topic1.split('/')[0]}_{idx}"
    else:
        template = random.choice(mentee_templates)
        user_id = f"mentee_{topic1.split('/')[0]}_{idx}"
        
    text = template.format(topic=topic1, adj=adj)
    if random.random() > 0.5:
        text += f" Also interested in {topic2}."
        
    return {
        "user_id": user_id,
        "user_type": user_type,
        "transcript": text
    }

def main():
    print("Generating Synthetic Data...")
    
    count = 0
    # Generate 25 Mentors
    for i in range(25):
        data = generate_user("mentor", i)
        try:
            requests.post(f"{BASE_URL}/session", json=data)
            print(f"Created {data['user_id']}")
            count += 1
        except:
            print(f"Failed to create {data['user_id']}")

    # Generate 25 Mentees
    for i in range(25):
        data = generate_user("mentee", i)
        try:
            requests.post(f"{BASE_URL}/session", json=data)
            print(f"Created {data['user_id']}")
            count += 1
        except:
            print(f"Failed to create {data['user_id']}")
            
    print(f"\nExample Queries you can try:")
    print("- 'I need help with fundraising'")
    print("- 'Struggling with public speaking'")
    print("- 'Want to learn AI'")
    
    print(f"\nSuccessfully populated {count} users.")

if __name__ == "__main__":
    main()
