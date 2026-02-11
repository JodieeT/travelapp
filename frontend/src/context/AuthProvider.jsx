import {AuthContext} from "./AuthContext.jsx";
import {useCallback, useEffect, useState} from "react";

const TOKEN_KEY = 'token'

function decodeToken(token) {
    try {
        const payload = token.split('.')[1]
        if (!payload) return null
        const decoded = JSON.parse(
            atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        )
        return {
            id: decoded.sub,
            username: decoded.username,
            role: decoded.role,
        }
    } catch {
        return null
    }
}

function readUserFromToken() {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return null
    const user = decodeToken(token)
    if (!user) {
        localStorage.removeItem(TOKEN_KEY)
        return null
    }
    return user
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setUser(readUserFromToken())
        setLoading(false)
    }, [])

    const login = useCallback((token, userInfo) => {
        localStorage.setItem(TOKEN_KEY, token)
        setUser(userInfo ?? decodeToken(token))
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}