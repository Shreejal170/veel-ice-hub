import torch
from src.ports.internal import IPromptInjectionDetectorPort

class DistilBERTPromptInjectionAdapter(IPromptInjectionDetectorPort):
    def __init__(self, tokenizer, model):
        """
        We inject the raw tokenizer and model so this adapter 
        doesn't handle file I/O or heavy loading times.
        """
        self.tokenizer = tokenizer
        self.model = model
        
        # Determine if a GPU is available to speed up inference
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def is_injection(self, text: str) -> bool:
        """
        Takes raw text, tokenizes it, runs it through the LoRA model, 
        and returns True if it's an attack.
        """
        try:
            # 1. Tokenize the input (truncating to DistilBERT's 512 token limit)
            inputs = self.tokenizer(
                text, 
                return_tensors="pt", 
                truncation=True, 
                max_length=512
            ).to(self.device)

            # 2. Run inference without calculating gradients (saves memory/time)
            with torch.no_grad():
                outputs = self.model(**inputs)
                
                # Convert raw logits to probabilities
                probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
                
                # Get the highest probability class
                predicted_class_idx = torch.argmax(probabilities, dim=1).item()

            # IMPORTANT: Adjust this index based on your specific training labels!
            # Assuming Class 1 = "INJECTION" and Class 0 = "SAFE"
            INJECTION_LABEL_INDEX = 1 
            
            return predicted_class_idx == INJECTION_LABEL_INDEX

        except Exception as e:
            # Security fail-safe: If the model crashes, assume it's dangerous
            # Better to block a safe comment than let a payload through.
            print(f"DistilBERT IPS Error: {str(e)}")
            return True