interface PasswordItem {
    id: string;
    type: "password";
    website: string;
    username: string;
    password: string;
}

interface CardItem {
    id: string;
    type: "card";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
}

interface PinItem {
    id: string;
    type: "pin";
    pin: string;
}

interface NoteItem {
    id: string;
    type: "note";
    note: string;
}

type VaultItem = PasswordItem | CardItem | PinItem | NoteItem;