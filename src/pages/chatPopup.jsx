import { useState } from "react"

const ChatPopup = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hola 👋 ¿En qué puedo ayudarte?", sender: "bot" }
  ])
  const [input, setInput] = useState("")

  const sendMessage = async () => {
  if (!input.trim()) return

  const userMessage = {
    text: input,
    sender: "user"
  }

  // mostrar mensaje usuario
  setMessages((prev) => [...prev, userMessage])

  const currentInput = input

  setInput("")

  try {
    const response = await fetch("http://localhost:3000/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: currentInput
      })
    })

    const data = await response.json()

    const botMessage = {
      text: data.reply,
      sender: "bot"
    }

    setMessages((prev) => [...prev, botMessage])

  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        text: "Error conectando con la IA",
        sender: "bot"
      }
    ])
  }
}

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#0d6efd",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000
        }}
      >
        💬
      </button>

      {/* Ventana chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#0d6efd",
              color: "white",
              padding: "12px",
              fontWeight: "bold"
            }}
          >
            Chat soporte
          </div>

          {/* Mensajes */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto"
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign:
                    msg.sender === "user"
                      ? "right"
                      : "left",
                  marginBottom: "10px"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background:
                      msg.sender === "user"
                        ? "#0d6efd"
                        : "#e9ecef",
                    color:
                      msg.sender === "user"
                        ? "white"
                        : "black"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ddd"
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí un mensaje..."
              style={{
                flex: 1,
                border: "none",
                padding: "10px"
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                border: "none",
                background: "#0d6efd",
                color: "white",
                padding: "10px 15px"
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatPopup