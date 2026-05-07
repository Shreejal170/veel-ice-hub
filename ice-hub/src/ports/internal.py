from abc import ABC, abstractmethod

class ISpamClassifierPort(ABC):
    @abstractmethod
    def is_spam(self, text: str) -> bool:
        pass


class IPromptInjectionDetectorPort(ABC):
    """
    Contract for the local security firewall.
    """
    @abstractmethod
    def is_injection(self, text: str) -> bool:
        pass