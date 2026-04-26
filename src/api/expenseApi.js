const BASE_URL = "https://localhost:7204/api/expense"

export async function getAllExpenses() {
  const response = await fetch(BASE_URL)
  const data = await response.json()
  return data
}

export async function createExpense(expense) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense)
  })
  const data = await response.json()
  return data
}

export async function updateExpense(id, expense) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense)
  })
  const data = await response.json()
  return data
}

export async function deleteExpense(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
}

const iconMap = {
  "UtensilsCrossed": "🍜",
  "Bus": "🚌",
  "Pill": "💊",
  "Zap": "💡",
  "ShoppingBag": "🛍️",
  "Gamepad2": "🎮",
  "Briefcase": "💼",
  "Laptop": "💻",
  "TrendingUp": "📈"
}

export async function getExpenseCategories() {
  const response = await fetch("https://localhost:7204/api/category")
  const data = await response.json()
  return data.map((cat) => ({
    ...cat,
    icon: iconMap[cat.icon] || "📦"
  }))
}