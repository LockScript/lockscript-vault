interface PasswordItem {
    type: "password";
    website: string;
    username: string;
    password: string;
}

interface CardItem {
    type: "card";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
}

interface PinItem {
    type: "pin";
    pin: string;
}

interface NoteItem {
    type: "note";
    note: string;
}

type VaultItem = PasswordItem | CardItem | PinItem | NoteItem;