import requests
import random
import time

BASE_URL = "http://localhost:8000"

# --- Persona Definitions ---

# Mentees: Looking for guidance
mentee_personas = [
    {
        "id": "founder_sarah",
        "voice": "Anxious but ambitious startup founder",
        "topics": ["fundraising", "scaling", "leadership"],
        "text": "I've just raised my seed round and frankly, I'm terrified. I need to scale the team from 5 to 20 in the next quarter, but I've never managed managers before. I'm losing sleep over culture and hiring mistakes. I need a mentor who has been through hypergrowth."
    },
    {
        "id": "engineer_mike",
        "voice": "Frustrated senior engineer wanting to switch tracks",
        "topics": ["career transition", "product management", "soft skills"],
        "text": "I've been coding for 8 years and I'm burnt out. I want to move into Product Management but I don't know how to demonstrate strategy. People see me as just a 'technical guy'. I need help with my pitch and understanding the product lifecycle beyond the code."
    },
    {
        "id": "marketer_jen",
        "voice": "Mid-level manager struggling with negotiation",
        "topics": ["negotiation", "conflict resolution", "promotion"],
        "text": "I feel like I'm constantly being talked over in meetings. I want to push for a promotion this cycle but I struggle with self-advocacy. I need advice on how to be more assertive without being labeled 'aggressive', and how to negotiate my salary."
    },
    {
        "id": "newgrad_alex",
        "voice": "Eager but lost new grad in AI",
        "topics": ["AI/ML", "job search", "networking"],
        "text": "I just graduated with an ML degree but the market is brutal. I have strong technical skills in PyTorch and transformers, but I don't know how to network. I want to build a portfolio that stands out. Looking for guidance on navigating the AI job market."
    },
    {
        "id": "pm_david",
        "voice": "Product Manager facing stakeholder conflict",
        "topics": ["stakeholder management", "communication", "roadmapping"],
        "text": "My engineering lead and design lead are at war, and it's stalling our roadmap. I feel stuck in the middle. I need advice on how to facilitate these tough conversations and get everyone aligned on the vision. It's affecting team morale."
    }
]

# Mentors: Offering expertise
mentor_personas = [
    {
        "id": "exec_elena",
        "voice": "Seasoned VP of Engineering",
        "topics": ["leadership", "scaling", "culture"],
        "text": "I've scaled engineering organizations from 10 to 200 engineers at two unicorns. I believe in empathetic leadership and psychological safety. I can help you build your hiring pipeline, reading the room, and managing up. I've seen every mistake in the book."
    },
    {
        "id": "cpo_marcus",
        "voice": "Chief Product Officer & Angel Investor",
        "topics": ["product strategy", "fundraising", "storytelling"],
        "text": "Product is about storytelling. I help founders and PMs craft narratives that win over investors and customers. If you're struggling with your pitch deck or your roadmap strategy, I can help you cut through the noise and focus on what matters."
    },
    {
        "id": "coach_priya",
        "voice": "Executive Coach focused on communication",
        "topics": ["public speaking", "negotiation", "confidence"],
        "text": "I specialize in helping quiet leaders find their voice. Whether it's salary negotiation or a board presentation, I focus on practical techniques to boost your presence. I've helped hundreds of professionals overcome imposter syndrome."
    },
    {
        "id": "cto_james",
        "voice": "Technical Co-founder turned CTO",
        "topics": ["system design", "startup", "technical debt"],
        "text": "I'm a pragmatic CTO who loves the messy early days of startups. I can mentor you on balancing technical debt with speed, choosing the right stack, and transitioning from 'coder' to 'technical leader'. I'm very direct and hands-on."
    },
    {
        "id": "director_olivia",
        "voice": "Director of Data Science",
        "topics": ["data science", "career growth", "mentorship"],
        "text": "I transitioned from academia to industry 15 years ago. I love helping detailed-oriented scientists become strategic leaders. We can talk about how to communicate data impact to non-technical stakeholders and how to manage a high-performance data team."
    }
]

def generate_variation(persona, index):
    """
    Creates a slight variation of the persona to avoid identical duplicates.
    """
    variations = [
        f" {persona['text']}",
        f"Hi, {persona['text']} Really hoping to connect.",
        f"{persona['text']} Specifically looking for diverse perspectives.",
        f"To give more context: {persona['text']}",
        f"{persona['text']} Ideally available for monthly calls."
    ]
    
    # Randomly pick a variation or keep original
    text = random.choice(variations)
    
    return {
        "user_id": f"{persona['id']}_{index}",
        "user_type": "mentor" if "exec" in persona['id'] or "cpo" in persona['id'] or "coach" in persona['id'] or "cto" in persona['id'] or "director" in persona['id'] else "mentee",
        "transcript": text
    }

def main():
    print("Generating Rich Persona Data...")
    
    # Clear existing? No, just append. User said "around 50".
    
    total = 0
    
    # Generate 25 Mentors (5 base personas * 5 variations)
    for i in range(5):
        for p in mentor_personas:
            data = generate_variation(p, i)
            data["user_type"] = "mentor" # Force type to be safe
            try:
                requests.post(f"{BASE_URL}/session", json=data)
                print(f"[\u2713] Created {data['user_id']}")
                total += 1
            except Exception as e:
                print(f"[X] Failed {data['user_id']}: {e}")

    # Generate 25 Mentees (5 base personas * 5 variations)
    for i in range(5):
        for p in mentee_personas:
            data = generate_variation(p, i)
            data["user_type"] = "mentee" # Force type
            try:
                requests.post(f"{BASE_URL}/session", json=data)
                print(f"[\u2713] Created {data['user_id']}")
                total += 1
            except Exception as e:
                print(f"[X] Failed {data['user_id']}: {e}")

    print(f"\nSuccessfully populated {total} rich persona profiles.")

if __name__ == "__main__":
    main()
