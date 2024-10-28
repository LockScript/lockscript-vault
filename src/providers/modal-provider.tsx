"use client"

import {PasswordModal} from "@/components/modals/password-modal";
import {VaultModal} from "@/components/modals/vault-modal";
import {useEffect, useState} from "react"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <VaultModal />
            <PasswordModal />
        </>
    )
}