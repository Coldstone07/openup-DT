import numpy as np

class PrivacyEngine:
    def __init__(self, epsilon: float = 1.0):
        self.epsilon = epsilon

    def add_noise(self, vector: np.ndarray) -> np.ndarray:
        """
        Adds Laplace noise to the embedding vector for differential privacy.
        """
        # Scale of noise is 1/epsilon (simplified for MVP)
        # In production, sensitivity analysis is required.
        scale = 1.0 / self.epsilon
        noise = np.random.laplace(0, scale, vector.shape)
        return vector + noise

    def anonymize_user_id(self, user_id: str) -> str:
        """
        Hashes user ID for simple pseudonymization.
        """
        import hashlib
        return hashlib.sha256(user_id.encode()).hexdigest()[:12]
