"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import config from "../config"

const AuthDebug = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [authInfo, setAuthInfo] = useState(null)

  const checkAuth = () => {
    const token = localStorage.getItem(config.tokenKey)
    const storedUser = localStorage.getItem(config.userKey)

    setAuthInfo({
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 15)}...` : null,
      hasUser: !!storedUser,
      user: storedUser ? JSON.parse(storedUser) : null,
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100"
      >
        🔑
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-80 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Auth Debug</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="text-sm">
        <p className="mb-2">
          <strong>Logged in:</strong> {user ? "Yes" : "No"}
        </p>
        {user && (
          <p className="mb-2">
            <strong>User:</strong> {user.name} ({user.email})
          </p>
        )}

        <button onClick={checkAuth} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm mb-2">
          Check Storage
        </button>

        {authInfo && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
            <p>
              <strong>Token in storage:</strong> {authInfo.hasToken ? "Yes" : "No"}
            </p>
            {authInfo.tokenPreview && (
              <p>
                <strong>Token preview:</strong> {authInfo.tokenPreview}
              </p>
            )}
            <p>
              <strong>User in storage:</strong> {authInfo.hasUser ? "Yes" : "No"}
            </p>
            {authInfo.user && <pre className="mt-1">{JSON.stringify(authInfo.user, null, 2)}</pre>}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthDebug
