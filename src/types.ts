interface PasswordItem {
    id: string;
    userId: string;
    type: "password";
    website: string;
    username: string;
    password: string;
}

interface CardItem {
    id: string;
    userId: string;
    type: "card";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
}

interface PinItem {
    id: string;
    userId: string;
    type: "pin";
    pin: string;
}

interface NoteItem {
    id: string;
    userId: string;
    type: "note";
    note: string;
}

type VaultItem = PasswordItem | CardItem | PinItem | NoteItem;